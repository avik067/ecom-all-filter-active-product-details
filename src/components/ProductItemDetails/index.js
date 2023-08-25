// Write your code here
import {Redirect, Link} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const ProductItemDetails = ({history, location, match}) => {
  console.log('This is ProductItemDetails')
  const {params} = match
  const [memory, setMemory] = useState({mainProduct: {}, similarProduct: []})

  async function getData() {
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const jsonData = await response.json()
    console.log(jsonData)

    if (response.ok) {
      const newObMain = {
        id: jsonData.id,
        imageUrl: jsonData.image_url,
        title: jsonData.title,
        style: jsonData.style,
        price: jsonData.price,
        description: jsonData.description,
        brand: jsonData.brand,
        totalReviews: jsonData.total_reviews,
        rating: jsonData.rating,
        availability: jsonData.availability,
      }
      console.log(newObMain)
      const similarObArr = jsonData.similar_products

      setMemory({
        ...memory,
        mainProduct: newObMain,
        similarProduct: similarObArr,
      })
    } else {
      console.log('No data Found try with different filter')
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const {
    imageUrl,
    title,
    style,
    price,
    description,
    brand,
    totalReviews,
    rating,
    availability,
  } = memory.mainProduct

  return (
    <>
      <Header />
      <div className="upper-main row ">
        <div>
          <img className="main-specific-img" src={imageUrl} alt={title} />
        </div>

        <ul className="loweer-similar">
          <li>
            <h1>{title}</h1>
          </li>
          <li>
            <p>{price}</p>
          </li>
          <li className="row center align-center">
            <div className="rating-div row ceneter align-center">
              <div>{rating}</div>
              <div>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
            </div>
            <p>{totalReviews} Reviews</p>
          </li>
          <li>
            <p>{description}</p>
          </li>
          <li>Available: {availability}</li>
          <li>Brand: {brand}</li>
        </ul>
      </div>
    </>
  )
}

export default ProductItemDetails
