import React, { useContext } from 'react'
import Dashboard from './Dashboard'
import { Navigatecontext } from './Navigatecontext'
import Activities from './Activities'
import Services from './Services'
import Scheduler from './Scheduler'

export default function Content() {
    const {navistate, setNavistate} = useContext(Navigatecontext)
  return (
    <div className='content'>
        {navistate == "Dashboard"?<Dashboard/>: navistate == "Activities"? <Activities/>: navistate == "Services"? <Services/>:<Scheduler />}
    </div>
  )
}
