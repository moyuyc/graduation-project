import React from 'react'
import {Map} from 'immutable'
import classname from 'classname'
import {isBrowser} from '../../common/utils'
const css = isBrowser ? require('./style.less') : require('./style.less')

export default ({items=[]}) =>
    <ul className={css.main}>
        {
            items.map((item, i)=>
                <li className={css.item+" "+(item.active?css.active:'')} key={i}>
                    <span  onClick={item.onClick}>{item.text}</span>
                </li>
            )
        }
    </ul>