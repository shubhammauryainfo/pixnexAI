import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonials from '../components/Testimonials'
import GenerateBtn from '../components/GenerateBtn'
import Features from '../components/Features'

const Home = () => {
  return (
    <div>
      <Header />
      <Features />
      <Steps />
      <Description />
      <Testimonials />
      <GenerateBtn />
    </div>
  )
}

export default Home
