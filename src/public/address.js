export default onNewIP => {
    const myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    const pc = new myPeerConnection({
            iceServers: []
        }),
        noop =  () => {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

    const iterateIP = ip => {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    pc.createDataChannel("");

    pc.createOffer().then((sdp) => {
        sdp.sdp.split('\n').forEach((line) => {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch( (reason) =>{

    });

    //sten for candidate events
    pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}
