import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { LaunchTile, Header, Button, Loading } from "../components";

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const Launches = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleFetchMore = async () => {
    setIsLoadingMore(true);
    await fetchMore({
      variables: {
        after: data.launches.cursor,
      },
    });

    setIsLoadingMore(false);
  };

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <>
      <Header />
      {data.launches?.launches?.map((launch) => (
        <LaunchTile key={launch.id} launch={launch} />
      ))}
      {data.launches?.hasMore &&
        (isLoadingMore ? (
          <Loading />
        ) : (
          <Button onClick={handleFetchMore}>Load More</Button>
        ))}
    </>
  );
};

export default Launches;
