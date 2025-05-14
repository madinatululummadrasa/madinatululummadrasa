import { Helmet } from 'react-helmet-async'
import Hero from '../../components/Home/Hero/Hero'
import About from '../../components/Home/Hero/AboutSection/About/About'
import SpeechSection from '../../components/Home/SpeechSection/SpeechSection'
import TeachersSection from '../../components/Home/TeachersSection/TeachersSection'
import PhotoAndGallerySection from '../../components/Home/PhotoAndGallerySection/PhotoAndGallerySection'


const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Madinatul Ulum Madrasa | Islamic Education</title>
      </Helmet>
      <Hero></Hero>
      <About></About>
      <SpeechSection></SpeechSection>
      <TeachersSection></TeachersSection>
      <PhotoAndGallerySection></PhotoAndGallerySection>
      
      
      

    </div>
  )
}

export default Home


