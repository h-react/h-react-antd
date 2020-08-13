class Preprocessing {

  constructor(apiFunction) {
    if (typeof apiFunction !== 'function') {
      throw 'Preprocessing must has api function';
    }
    this.apiFunction = apiFunction;
  }

  name() {
    return 'Preprocessing';
  }

  query() {
    return this.apiFunction();
  }

}

export default Preprocessing;