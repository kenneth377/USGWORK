import React, { useContext } from 'react'
import "./styles/dashboard.css"
import { Allcontext } from '../Allcontext'

export default function Dashboard() {

    const {users, services, activityData} = useContext(Allcontext)
    console.log("dashi",activityData)
  return (
    <div className='dashboard'>
        <div className="mindatabox">
            <div className='minidata'>
                <p className="minihead">
                    Total services
                </p>
                <p className="minicount">{Object.keys(services).length}</p>
            </div>
            <div className='minidata'>
            <p className="minihead">
                    Total Logs
                </p>
                <p className="minicount">{activityData.length}</p>
            </div>
            <div className='minidata'>
            <p className="minihead">
                    Total services
                </p>
                <p className="minicount">24</p>
            </div>
            <div className='minidata'>
            <p className="minihead">
                    Total services
                </p>
                <p className="minicount">24</p>
            </div>
        </div>
        <div className="graphsbox">
            <div className="maingraph">

            </div>
            <div className="others">
                <div className="firstminor">

                </div>
                <div className="lastminor"></div>
            </div>
        </div>
    </div>
  )
}
