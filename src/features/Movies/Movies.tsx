import { Movie, fetchMovies } from "../../reducers/movies";
import { connect } from "react-redux";
import { RootState } from "../../store";
import MovieCard from "./MovieCard";

import styles from "./Movies.module.scss";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";

//....
interface MoviesProps {
  movies: Movie[];
  loading: boolean;
}

function Movies({ movies, loading }: MoviesProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  return (
    <section>
      <div className={styles.list}>
        {loading ? (
          <h3>Loading...</h3>
        ) : (
          movies.map((item) => {
            return (
              <MovieCard
                key={item.id}
                id={item.id}
                title={item.title}
                overview={item.overview}
                popularity={item.popularity}
                image={item.image}
              />
              // <MovieCard  key={item.id} {...item}/>
            );
          })
        )}
      </div>
    </section>
  );
}

const mapStateToProps = (state: RootState) => ({
  movies: state.movies.top,
  loading: state.movies.loading,
});

const connector = connect(mapStateToProps);

export default connector(Movies);
