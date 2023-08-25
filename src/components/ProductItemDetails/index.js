import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const ProductItemDetails = ({match}) => {
  console.log('This is ProductItemDetails')
  const {params} = match
  const [memory, setMemory] = useState({
    mainProduct: {},
    similarProduct: [],
  })
  const [memory1, setMemory1] = useState(1)

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

      const similarObArr = jsonData.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        style: each.style,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
      }))

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

  function upperRender() {
    return (
      <div className="upper-main row center wrap ">
        <div className="main-specific-img">
          <img className="main-specific-img" src={imageUrl} alt={title} />
        </div>

        <ul className="right-description">
          <li>
            <h1 className="product-specific-heading">{title}</h1>
          </li>
          <li>
            <p className="roboto bold">RS {price}/-</p>
          </li>
          <li className="row  align-center">
            <div className="rating-div row  align-center">
              <div>{rating}</div>
              <img
                className="icon"
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </div>
            <p>{totalReviews} Reviews</p>
          </li>
          <li>
            <p className="description-para">{description}</p>
          </li>
          <li>
            <p>
              <span className="bold">Available:</span>{' '}
              <span className="description-para">{availability}</span>
            </p>
          </li>
          <li>
            <p>
              <span className="bold">Brand:</span>{' '}
              <span className="description-para">{brand}</span>
            </p>
          </li>
          <li>
            <hr />
          </li>
          <li>
            <button
              className="incre-but change"
              type="button"
              onClick={() => {
                if (memory1 > 0) setMemory1(pre => pre - 1)
              }}
            >
              -
            </button>
            <span className="quantity">{memory1}</span>
            <button
              className="decre-but change"
              type="button"
              onClick={() => {
                setMemory1(pre => pre + 1)
              }}
            >
              +
            </button>
          </li>
          <li>
            <br />
            <button type="button" className="add-to-cart bold roboto">
              ADD TO CART
            </button>
          </li>
        </ul>
      </div>
    )
  }

  function lowerRender() {
    return (
      <div className="lower-main  ">
        <h1>Similar Products</h1>
        <ul className="row wrap">
          {memory.similarProduct.map(each => (
            <SimilarProductItem each={each} />
          ))}
        </ul>
      </div>
    )
  }
  return (
    <>
      <Header />
      {upperRender()}
      {lowerRender()}
    </>
  )
}

export default ProductItemDetails
