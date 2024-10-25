import React from 'react'
import "./styles/dashboard.css"

export default function Dashboard() {
  return (
    <div className='dashboard'>
        <div className="mindatabox">
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
