var api_endpoint = "http://127.0.0.1:3000";

const apiMaps = JSON.parse(import.meta.env.VITE_API_MAP);
if (window.location.hostname in apiMaps)
    api_endpoint = apiMaps[window.location.hostname];
else if ("default" in apiMaps) api_endpoint = apiMaps["default"];

function listCase(
  page = 1,
  limits = 10,
  sortBy = "_id",
  sortOrder = 1,
  search = {}
) {
  return fetch(
    `${api_endpoint}/cases/${page}/${limits}/${sortBy}/${sortOrder}?${new URLSearchParams(
      search
    ).toString()}`
  );
}

function getCase(id) {
  return fetch(`${api_endpoint}/case/${id}`);
}

function getRandomCase() {
  return fetch(`${api_endpoint}/random`);
}

function getCount() {
  return fetch(`${api_endpoint}/count`);
}

export { listCase, getCase, getRandomCase, getCount };
