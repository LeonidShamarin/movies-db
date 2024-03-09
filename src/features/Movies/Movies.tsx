import { useContext, useEffect, useState } from "react";
import { fetchNextPage, resetMovies } from "./moviesSlice";
import MovieCard from "./MovieCard";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { Container } from "@mui/system";
import { Grid, LinearProgress } from "@mui/material";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { Filters, MoviesFilter } from "./MoviesFilter";

function Movies() {
  const [filters, setFilters] = useState<Filters>();
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movies.top);
  const loading = useAppSelector((state) => state.movies.loading);
  const hasMorePages = useAppSelector((state) => state.movies.hasMorePages);

  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;

  //підвантаження при прокрутці
  const [targetRef, entry] = useIntersectionObserver();

useEffect(()=> {
  dispatch(resetMovies())
},[dispatch])


  useEffect(() => {
    if (entry?.isIntersecting && hasMorePages) {
      const moviesFilters = filters
      ? {
        keywords : filters.keywords.map((k)=>k.id),
        genres: filters?.genres,
      }
      : undefined;

      dispatch(fetchNextPage(moviesFilters));
    }
  }, [dispatch, entry?.isIntersecting, filters, hasMorePages]);

  return (
    <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
      <Grid item xs="auto">
        <MoviesFilter
          onApply={(f) => {
            dispatch(resetMovies())
            setFilters(f);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Container sx={{ py: 8 }} maxWidth="lg">
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
          <div ref={targetRef}>{loading && <LinearProgress color="secondary" sx={{ mt: 3 }} />}</div>
        </Container>
      </Grid>
    </Grid>
  );
}

export default Movies;
