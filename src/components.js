import React, { Component } from 'react'

export const SplitPanelTitle = ({name, title, children}) => {
    return (
        <strong className="title">
            <span title={title}>{name} </span>
            <div className="btns">{children}</div>
        </strong>
    )
}
export const SplitPanelAction = ({name, title, children}) => {
    return (
        <div className="action">
            {React.Children.map(children, (child) => { return child })}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg> */}
        </div>
    )
}
export const SplitPanelHead = ({name, title, className, children}) => {
    return (
        <div className={"top-bar " + className}>
            {React.Children.map(children, (child) => {
                return child
            })}
        </div>
    )
}
export const SplitPanelContent = ({children}) => {
    return (
        <div className="content">{children}</div>
    )
}
export const SplitPanel = ({name, title, children}) => {
    return (
        <div className={'cell ' + name}>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {name, title})
            })}
        </div>
    )
}
