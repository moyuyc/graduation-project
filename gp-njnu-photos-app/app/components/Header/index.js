import React from 'react'
import {Map} from 'immutable'
import {isBrowser} from '../../common/utils'
const css = isBrowser ? require('./style.less') : require('./style.less')

const renderItem = (item, i) => {
    if(item.sublist) {
        return  <li className={`${css.dropdown} ${item.active?css.active:''}`} key={i}>
                  <span><span>{item.text}</span><i className={css.icon}></i></span>
                  <ul>
                    {item.sublist.map((item, i)=><li key={i} onClick={item.onClick}><a className={css.seo} href={item.url}>{item.text}</a><span>{item.text}</span></li>)}
                  </ul>
                </li>
    }
    if(item.type==='btn') {
        return <li key={i}><a className={css.seo} href={item.url}>{item.text}</a><span onClick={item.onClick} className={css.btn}>{item.text}</span></li>
    }
    return <li key={i} className={`${item.active?css.active:''}`} onClick={item.onClick}><a className={css.seo} href={item.url}>{item.text}</a><span>{item.text}</span></li>
}

export default ({showLogo=true, logo="", leftItems=[{text: '学生签到', active: true}, {text: '关于'}], 
        rightItems=[{text: '关于'}, {text: '管理员入口', type: 'btn'}]}) =>
    <header className={css.main}>
        {showLogo && <span className={css.logo}>{logo}</span>}
        <ul className={css.left}>
            {
                leftItems.map(renderItem)
            }
        </ul>
        <ul className={css.right}>
            {
                rightItems.map(renderItem)
            }
        </ul>
    </header>
