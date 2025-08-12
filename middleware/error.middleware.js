module.exports = (err, req, res, next) => {
  const response = {
    status: err.status || 500,
    message: err.status >= 500 ?
      'Internal Server Error' : err.message || 'Something went wrong',
  };


  if (response.status >= 500) {
    console.warn(`□■□■ [${new Date().toLocaleString()}] ■□■□`);
    console.error(err)
  };
  

  if (response.status < 500 && err.data) {
    response.data = err.data;
  }

  res.status(response.status).json(response);
};