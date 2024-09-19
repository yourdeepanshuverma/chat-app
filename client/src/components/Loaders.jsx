import { CircularProgress, Grid, Skeleton, Stack } from "@mui/material";
import React from "react";

export default function LayoutLoader() {
  return (
    <Grid container spacing={1} height={"calc(100vh - 4rem)"}>
      <Grid
        item
        sm={4}
        md={3}
        sx={{
          display: { xs: "none", sm: "block" }
        }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        lg={6}
        height={"100%"}
        overflow={"hidden"}
      >
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton variant="rounded" height={"5rem"} key={index} />
          ))}
        </Stack>
      </Grid>
      <Grid
        item
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
        }}
        height={"100%"}>
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
    </Grid>
  );
}

export const CircleLoader = () => {
  return (
    <Stack
      position={"absolute"}
      top={"1rem"}
      right={"1rem"}>
      <CircularProgress />
    </Stack>
  );
}
