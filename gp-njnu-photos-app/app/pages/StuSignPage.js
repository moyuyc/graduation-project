import React from 'react'
import {render} from 'react-dom'
import Tabs from '../components/TabNav'
import InputGroup from '../components/InputGroup'
import TakePhoto from '../components/TakePhoto'

const db = require('../common/storage')
const utils = require('../common/utils')


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.getTabsProps=this.getTabsProps.bind(this)
    }
    getTabsProps() {
        const {actions, state} = this.props
        const {upface} = state
        const {activeSrc} = upface

        return [
            {text: '摄像头', active: activeSrc==='camera', onClick: activeSrc!=='camera'?()=>actions.switchUpFaceSrc('camera'):null},
            {text: '上传图片', active: activeSrc==='file', onClick: activeSrc!=='file'?()=>actions.switchUpFaceSrc('file'):null},
            {text: '网络图片', active: activeSrc==='network', onClick: activeSrc!=='network'?()=>actions.switchUpFaceSrc('network'):null}
        ]
        
    }

    render() {
        const {actions, state} = this.props
        const {upface} = state
        const {activeSrc, searchText, searching, camera, file, network} = upface
        const {data} = camera
        const {data: fData} = file
        const {url} = network

        console.log(state)
        return (
            <div style={{backgroundColor: '#fff', padding: '16px 10px'}}>
                <Tabs items={this.getTabsProps()} />
                <div style={{ minHeight: 400, overflowX: 'hidden'}}>
                    <div className="animated fadeInLeft" style={{display: activeSrc!=='camera'?'none':''}}>
                        <TakePhoto onPhotoCallback={actions.setCameraData} data={data}/>
                    </div>
                    {activeSrc==='file' && <div className="animated fadeInDown" style={{width: 500,  textAlign: 'center', margin: '30px auto auto'}}>
                        <InputGroup ref={r=>this.file=r} btnText="上传图片" 
                            btnProps={{
                                disabled: searching,
                                onClick: ()=>{
                                    const {input, btn} = this.file
                                    input.click()
                                }
                            }}
                            inputProps={{
                                disabled: false, accept: "image/*", style: {textIndent: 0, lineHeight: '32px'}, type:"file", placeholder: "选择文件",
                                onChange: e=>{
                                    const {input, btn} = this.file
                                    const file = input.files[0]
                                    const size = file.size
                                    if(size>1024*1024*2) {
                                        utils.showToast("文件大小不能大于2M")
                                        return
                                    }

                                    const fr = new FileReader()
                                    fr.readAsDataURL(file);
                                    fr.onload=()=>{
                                        actions.setFileData(fr.result)
                                    }
                                }
                            }}/>
                        <img style={{maxWidth: '100%'}} src={fData} />
                    </div>}
                    {activeSrc==='network' && <div className="animated fadeInRight" style={{width: 500, textAlign: 'center', margin: '30px auto auto'}}>
                        <InputGroup showBtn={false} btnText="网络图片" 
                            inputProps={{
                                disabled: false, value: url, placeholder: "图片URL",
                                onChange: e=>{
                                    actions.setNetUrl(e.target.value)
                                }
                            }}
                        />
                        <img style={{maxWidth: '100%'}} src={url} />
                    </div>}
                </div>
                <hr/>
                <div style={{minWidth: 400, width: '67%', margin: 'auto'}}>
                    <InputGroup btnText="签到" 
                        btnProps={{
                            disabled: searching,
                            onClick: ()=>{
                                if(searchText.trim()!=='') db.set('search-text', searchText);
                                else utils.showToast('不能为空')
                            }
                        }}
                        inputProps={{
                            disabled: searching, value: searchText, 
                            onChange: (e)=>{actions.setSearchText(e.target.value)},
                            placeholder: '输入班级号或者课程号（如191301）'
                        }} />
                </div>
            </div>
        )
    }
}