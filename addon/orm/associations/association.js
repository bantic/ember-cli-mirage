class Association {

  constructor(type) {
    this.type = type;

    // The model type that holds/owns this association
    this.possessor = '';

    // The model type this association refers to
    this.referent = '';
  }

}

export default Association;
