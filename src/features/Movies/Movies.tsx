import { useContext, useEffect } from "react";
import { fetchNextPage } from "./moviesSlice";
import MovieCard from "./MovieCard";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { Container } from "@mui/system";
import { Grid, LinearProgress, Typography } from "@mui/material";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

function Movies() {
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movies.top);
  const loading = useAppSelector((state) => state.movies.loading);
  const hasMorePages = useAppSelector((state) => state.movies.hasMorePages);

  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;

  //підвантаження при прокрутці
  const [targetRef, entry] = useIntersectionObserver();

  useEffect(() => {
    if (entry?.isIntersecting && hasMorePages) {
      dispatch(fetchNextPage());
    }
  }, [dispatch, entry?.isIntersecting, hasMorePages]);

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Now playing
      </Typography>

      <Grid container spacing={4}>
        {movies.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <MovieCard
              key={item.id}
              id={item.id}
              title={item.title}
              overview={item.overview}
              popularity={item.popularity}
              image={item.image}
              enableUserActions={loggedIn}
            />
          </Grid>
        ))}
      </Grid>
      {/* коли йде скрол до низу буде відображатись лоадіндикатор */}
      <div ref={targetRef}>
       { loading && <LinearProgress color="secondary" sx={{ mt: 3 }} />}
      </div>
    </Container>
  );
}

export default Movies;
