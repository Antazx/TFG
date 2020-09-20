const loginHandler = (res) => {
  return res.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!res.ok) {
      const error = (data && data.error) || res.statusText;
      return Promise.reject(error);
    }
    return data;
  });
};

const checkResponse = (res) => {
  return res.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('user');
        location.reload(true);
      }
      const error = (data && data.error) || res.statusText;
      return Promise.reject(error);
    }
    return data;
  });
};

const downloadResponse = (res, filename) => {
  if (!res.ok) return Promise.reject();

  res.blob().then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  });
};
const responseHandler = { loginHandler, checkResponse, downloadResponse };
export default responseHandler;
