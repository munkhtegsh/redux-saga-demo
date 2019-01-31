import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga() {
  yield takeLatest("API_CALL_REQUEST", workerSaga);
}

// function that makes the api request and returns a Promise for response
function fetchDog() {
  return axios({
    method: "get",
    url: "https://dog.ceo/api/breeds/image/random"
  });
}

// worker saga: makes the api call when watcher saga sees the action
// The function* declaration (function keyword followed by an asterisk) defines a generator function, which returns a Generator object.
// Generators are functions which can be exited and later re-entered. Their context(var bindings) will be saved across re-entrances
function* workerSaga() {
  try {
    const response = yield call(fetchDog);
    const dog = response.data.message;

    // dispatch a success action to the store with the new dog
    // yield in a generator basically represents an asynchronous step in a more synchronous / sequential process — somewhat like await in an async function.
    yield put({ type: "API_CALL_SUCCESS", dog });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: "API_CALL_FAILURE", error });
  }
}
