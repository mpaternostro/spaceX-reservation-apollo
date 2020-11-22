const { RESTDataSource } = require("apollo-datasource-rest");

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spacexdata.com/v3/";
  }

  async getAllLaunches() {
    const response = await this.get("launches");
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : [];
  }

  async getLaunchById({ launchId }) {
    const response = await this.get("launches", launchId);
    return this.launchReducer(response);
  }

  getLaunchesById({ launchIds }) {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId }))
    );
  }

  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: launch.launch_date_unix.toString(),
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: mission_name,
        missionPatchSmall: links.mission_patch_small,
        missionPatchLarge: links.mission_patch,
      },
      rocket: {
        id: rocket.rocket_id,
        name: rocket.rocket_name,
        type: rocket.rocket_type,
      },
    };
  }
}

module.exports = LaunchAPI;
