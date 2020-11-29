const { paginateResults } = require("./utils");

module.exports = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },
    launch: (_, launchId, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId }),
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) {
        user.token = Buffer.from(email).toString("base64");
        return user;
      }
    },
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesById({
        launchIds,
      });
      const success = results && results.length === launchIds.length;
      const notBookedLaunches = launchIds.filter((id) => !results.includes(id));
      return {
        success,
        message: success
          ? "trips booked successfully"
          : `the following launches couldn't be booked: ${notBookedLaunches}`,
        launches,
      };
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });
      if (!result) {
        return {
          success: false,
          message: "failed to cancel trip",
        };
      }

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: "trip cancelled",
        launches: [launch],
      };
    },
  },
  Mission: {
    missionPatch: (mission, { size } = { size: "LARGE" }) =>
      size === "SMALL" ? mission.missionPatchSmall : mission.missionPatchLarge,
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
      if (launchIds.length === 0) {
        return [];
      }
      return dataSources.launchAPI.getLaunchesById({ launchIds }) || [];
    },
  },
};
