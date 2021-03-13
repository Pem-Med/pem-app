import uuid from 'react-native-uuid'

class Cmes{
    constructor(cert, exp, image){
        this.cert = cert;
        this.exp = exp;
        this.image = image;
        this.id = uuid.v1();

    }
}

export default Cmes;