"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

const SliderContainer = styled.div`
  width: 100%;
  height: 90vh;
  overflow: hidden;
  position: relative;
`

const Slide = styled.div`
  width: 100%;
  height: 90vh;
  background-image: url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: ${(props) => (props.active ? "0" : "100%")};
  transition: left 0.5s ease-in-out;
`

const TextContainer = styled.div`
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5); 
  padding: 1.5rem 2rem;
  border-radius: 10px;
  max-width: 70%;
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white; 
  margin-bottom: 1rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
`

const Subtitle = styled.p`
  font-size: 1.25rem;
  font-style: italic;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
`

const StyledButton = styled(Link)`
  font-weight: bold;
  background-color: #ea580c; /* Оранжевий колір для будівельної тематики */
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
  color: white;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  border-radius: 5px;

  &:hover {
    transform: scale(1.05);
    background-color: #c2410c;
  }
`

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => (props.left ? "left: 20px;" : "right: 20px;")}

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#ea580c" : "rgba(255, 255, 255, 0.5)")};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#ea580c" : "rgba(255, 255, 255, 0.8)")};
  }
`

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isLoading = false

  const slides = [
    {
      id: 1,
      title: "Якісні будівельні матеріали",
      subtitle: "Широкий асортимент товарів для будівництва та ремонту",
      image: "https://media.istockphoto.com/id/104294966/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D0%BA%D0%BB%D0%B0%D0%B4%D0%B5%D0%BD%D1%96-%D0%BF%D0%B8%D0%BB%D0%BE%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D1%96%D0%B0%D0%BB%D0%B8-%D1%82%D0%B0-%D0%BA%D1%80%D0%B5%D1%81%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F-%D0%BD%D0%B0-%D0%B1%D1%83%D0%B4%D1%96%D0%B2%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%D1%83-%D0%BC%D0%B0%D0%B9%D0%B4%D0%B0%D0%BD%D1%87%D0%B8%D0%BA%D1%83.jpg?s=2048x2048&w=is&k=20&c=8mgBqmAyK11Jcex4l5HUKFuZNvsCmbZoLE_KOrsEoV4=",
      link: "/catalog",
    },
    {
      id: 2,
      title: "Знижки до 30% на інструменти",
      subtitle: "Обмежена пропозиція на професійні інструменти",
      image: "https://media.istockphoto.com/id/682578174/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%B1%D1%83%D0%B4%D1%96%D0%B2%D0%B5%D0%BB%D1%8C%D0%BD%D1%96-%D1%96%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B8-%D1%82%D0%B0-%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D1%96%D0%B0%D0%BB%D0%B8-%D0%B2%D1%81%D0%B5%D1%80%D0%B5%D0%B4%D0%B8%D0%BD%D1%96-%D0%BA%D0%BE%D1%88%D0%B8%D0%BA%D0%B0-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BE%D0%BA-3d-%D1%96%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B0%D1%86%D1%96%D1%8F.jpg?s=2048x2048&w=is&k=20&c=15DOy8cBx5oWkCHNauJe4Df5L1EZd-_gWvcEtCAm_B0=",
      link: "/category/1",
    },
    {
      id: 3,
      title: "Безкоштовна доставка",
      subtitle: "При замовленні від 5000 грн",
      image: "https://media.istockphoto.com/id/1282047643/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%BA%D0%BB%D0%B0%D1%81%D0%B8%D1%87%D0%BD%D0%B8%D0%B9-%D0%B2%D0%B5%D0%BB%D0%B8%D0%BA%D0%B8%D0%B9-%D0%B1%D1%83%D1%80%D0%BE%D0%B2%D0%B8%D0%B9-%D0%BD%D0%B0%D0%BF%D1%96%D0%B2%D0%BF%D1%80%D0%B8%D1%87%D1%96%D0%BF-%D1%82%D1%80%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%B0-%D1%89%D0%BE-%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B7%D0%B8%D1%82%D1%8C-%D0%BF%D0%B8%D0%BB%D0%BE%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D1%96%D0%B0%D0%BB%D0%B8-%D0%BD%D0%B0-%D0%BF%D0%BB%D0%BE%D1%81%D0%BA%D0%BE%D0%BC%D1%83-%D0%BB%D1%96%D0%B6%D0%BA%D1%83.jpg?s=2048x2048&w=is&k=20&c=zG-JLbHu77k0bPjo0qUbraEsd2e4DAj4zhi9vCeiQYI=",
      link: "/delivery",
    },
    {
      id: 4,
      title: "Професійні консультації",
      subtitle: "Наші експерти допоможуть з вибором матеріалів",
      image: "https://media.istockphoto.com/id/1394287642/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%82%D0%B5%D1%81%D0%BB%D1%8F%D1%80-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8-%D0%B2-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D1%96-%D0%BE%D0%B1%D0%BB%D0%B0%D0%B4%D0%BD%D0%B0%D0%BD%D0%BD%D1%8F.jpg?s=2048x2048&w=is&k=20&c=7cgvbEgNXjvHNy_0ddvohYETdjHUWQuXkMWoWK9pAU0=",
      link: "/contacts",
    },
  ]

  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5400)

    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (isLoading) {
    return (
      <SliderContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "#f3f4f6",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="spinner"
              style={{
                border: "4px solid rgba(0, 0, 0, 0.1)",
                borderLeft: "4px solid #ea580c",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            ></div>
            <p style={{ color: "#4b5563" }}>Завантаження слайдера...</p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </SliderContainer>
    )
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <SliderContainer>
      {slides.map((slide, index) => (
        <Slide key={index} bgImage={slide.image} active={index === currentSlide}>
          <TextContainer>
            <Title>{slide.title}</Title>
            <Subtitle>{slide.subtitle}</Subtitle>
            <StyledButton to={slide.link}>Дізнатись більше</StyledButton>
          </TextContainer>
        </Slide>
      ))}
      <NavButton left onClick={prevSlide}>
        &#10094;
      </NavButton>
      <NavButton onClick={nextSlide}>&#10095;</NavButton>

      <DotsContainer>
        {slides.map((_, index) => (
          <Dot key={index} active={index === currentSlide} onClick={() => goToSlide(index)} />
        ))}
      </DotsContainer>
    </SliderContainer>
  )
}

export default Slider
