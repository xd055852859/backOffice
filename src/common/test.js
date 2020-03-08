class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.state = {
            uptoken: null
        }

        switch (this.props.metaType) {
            case 'image': this.mimeType = ["image/png", "image/jpeg"]; this.accept = ".jpg, .jpeg, .png"; break;
            case 'video': this.mimeType = ["video/mp4", "video/ogg"]; this.accept = ".mp4, .ogg"; break;
            default: this.mimeType = ["image/png", "image/jpeg"]; this.accept = ".jpg, .jpeg, .png"; break;
        }
    }

    handleFileChange(event) {
        const { maxSize } = this.props;
        let uptoken = this.state.uptoken;
        if (!uptoken) {
            return;
        }

        let that = this;
        const domain = 'http://cdn-icare.qingtime.cn/';
        let files = event.target.files;
        if (!files[0]) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSize) {
                message.error('文件太大！');
                return;
            }
        }

        let putExtra = {
            // 文件原文件名
            fname: "",
            // 自定义变量
            params: {},
            // 限制上传文件类型
            mimeType: this.mimeType,
        };
        let config = {
            useCdnDomain: true,
            disableStatisticsReport: false,
            retryCount: 5,
            region: qiniu.region.z0
        };
        let uploaded = [];
        let observer = {
            next(res) {
            },
            error(err) {
                message.error('上传失败！');
                Loading.close();
            },
            complete(res) {
                uploaded.push(domain + encodeURIComponent(res.key));
                if (uploaded.length === files.length) {
                    message.success('上传成功');
                    that.props.callback(uploaded, that.props.extParam);
                    Loading.close();
                }
            }
        }
        Loading.open({ text: '上传中，请稍候...' });
        // 上传
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            // let observable = qiniu.upload(file, encodeURIComponent(file.name), uptoken, putExtra, config);
            let observable = qiniu.upload(file, `${util.common.guid(8, 16)}${file.name.substr(file.name.lastIndexOf('.'))}`, uptoken, putExtra, config);
            // 上传开始
            observable.subscribe(observer);
        }

    }
    async componentDidMount() {
        // 获取七牛token
        let res = await api.auth.getUptoken(localStorage.getItem('TOKEN'));
        if (res.msg === 'OK') {
            this.setState({ uptoken: res.result });
        } else {
            message.error(res.msg);
        }
    }
    render() {
        let fileInput = null;
        if (this.props.multiple) {
            fileInput = <input type="file" accept={this.accept} onChange={this.handleFileChange} multiple />
        } else {
            fileInput = <input type="file" accept={this.accept} onChange={this.handleFileChange} />
        }
        return (
            <i className={`file-upload-button ${this.props.className}`} style={this.props.style}>
                {fileInput}
                {this.props.text}
            </i>
        );
    }
}