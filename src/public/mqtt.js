export default class myMqtt {
    constructor(options, topic, callBack) {
        this.options = options;
        this.topic = topic;
        this.mqttConnect();
        this.callBack = callBack;
    }
    mqttConnect() {
        const client = new Paho.MQTT.Client(this.options.host, this.options.port, '');
        const _options = {
            userName: this.options.username,
            password: this.options.password,
            timeout: 5,
            keepAliveInterval: 1200,
            onSuccess: () => {
                console.log(`onConnected,订阅主题 ${this.topic}`);
                client.subscribe(this.topic); //订阅主题
            },
            onFailure: (e) => {
                console.log(e);
            }
        };
        client.onConnectionLost = responseObject => {
            this.onConnectionLost(responseObject);
        }; //注册连接断开处理事件
        client.onMessageArrived = message => {
            this.callBack && this.callBack(message.payloadString);
        };
        client.connect(_options);
        this.destroyed = client.disconnect;
    }
    onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log(`主题${this.topic}连接已断开,正在重新连接。。。`);
            this.mqttConnect();
        }
    }
    onMessageArrived(message) {
        // const msg = JSON.parse(message.payloadString);
        this.callBack && this.callBack(typeof msg === 'string' ? message : JSON.parse(message));
    }
}
