// ---------------------------
// HELPER FUNCTION << không sử dụng >>
module.exports = function (sortedMovies, page = 1) {
  // number of results / per page
  const RESULTS_PER_PAGE = 20;

  // count total pages of all results
  const totalPages = Math.ceil(sortedMovies.length / RESULTS_PER_PAGE);

  // check page is invalid (valid when page <= totalPage) => page = 1
  if (page > totalPages) page = 1;

  // count index to slice results from all movies
  const firstResultIndex = RESULTS_PER_PAGE * (page - 1);
  const endResultIndex = firstResultIndex + RESULTS_PER_PAGE;

  // slice results from all movies
  const results = sortedMovies.slice(firstResultIndex, endResultIndex);

  // return 1 object response
  return {
    results,
    page,
    total_pages: totalPages,
  };
};
