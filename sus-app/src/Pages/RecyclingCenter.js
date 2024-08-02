import React from 'react'
import Footer from '../components/Footer/Footer'
import MapContainer from '../components/MapContainer/MapContainer'
import RecyclableItems from '../components/RecycleableItems/RecycleableItems'
import Benefits from '../components/Benefits/Benefits'
import PickupForm from '../components/PickupFrom/PickupForm'
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const RecyclingCenter = () => {
  return (
    <>
    <MapContainer/>
    <RecyclableItems/>
    <PickupForm/>
    <NotificationContainer/>
    <Benefits/>
    <Footer/>
    </>
  )
}

export default RecyclingCenter
