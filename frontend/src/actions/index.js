import * as api from '../api';

export const getTraceData = () => (dispatch) => {
  api.getTraceData().then(data => {
    dispatch({
      type: 'SET_TRACE_DATA',
      data: data
    });
  });
};
