import $ from 'jquery';

const HOSTNAME = window.location.origin + '/';
const ajax = (options, func=$.ajax) => {
  return new Promise((resolve, reject) => {
    func(options).done(resolve).fail(reject);
  });
};

const getJson = (options) => ajax(options, $.getJson);

export const getTraceData = () => {
  return getJson({
    url: HOSTNAME + 'trace'
  });
};

// export const startSimulate = () => {
//   getJson({
//     url: HOSTNAME + 'start_simulate'
//   });
// };

export const setSample = (sample) => {
  getJson({
    url: HOSTNAME + 'sample',
    data: {
      'sample': sample
    }
  });
};
