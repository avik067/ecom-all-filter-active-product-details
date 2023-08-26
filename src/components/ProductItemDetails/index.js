import {useState, useEffect} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  notFound: 'not_Found',
}

const ProductItemDetails = ({history, match}) => {
  console.log('This is ProductItemDetails')
  const {params} = match
  const [memory, setMemory] = useState({
    mainProduct: {},
    similarProduct: [],
    loadingStatus: apiStatusConstants.initial,
  })
  const [memory1, setMemory1] = useState(1)

  async function getData() {
    setMemory({...memory, loadingStatus: apiStatusConstants.inProgress})
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

    if (response.ok === true) {
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
        loadingStatus: apiStatusConstants.success,
      })
    } else {
      setMemory({
        ...memory,
        mainProduct: {},
        similarProduct: [],
        loadingStatus: apiStatusConstants.failure,
      })
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
          <img className="main-specific-img" src={imageUrl} alt="product" />
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
              <div>
                <p>{rating}</p>
              </div>
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
            <div className="row align-center">
              <p className="bold">Available:</p>
              <p className="description-para">{availability}</p>
            </div>
          </li>
          <li>
            <div className="row align-center">
              <p className="bold">Brand: </p>
              <p className="description-para">{brand}</p>
            </div>
          </li>
          <li>
            <hr />
          </li>
          <li className="row align-center">
            <button
              className="incre-but change"
              type="button"
              data-testid="minus"
              onClick={() => {
                if (memory1 > 1) setMemory1(pre => pre - 1)
              }}
            >
              <BsDashSquare className="minus" />
            </button>
            <p className="quantity">{memory1}</p>
            <button
              className="decre-but change"
              type="button"
              data-testid="plus"
              onClick={() => {
                setMemory1(pre => pre + 1)
              }}
            >
              <BsPlusSquare className="plus" />
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
      <div className="lower-main ">
        <h1>Similar Products</h1>
        <ul className="row wrap">
          {memory.similarProduct.map(each => (
            <SimilarProductItem each={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  function loaderRender() {
    return (
      <div className="products-loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    )
  }

  function failureRender() {
    return (
      <div className="col center align-center">
        <img
          className="failure-img"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1>Product Not Found</h1>
        <button
          type="button"
          className="add-to-cart bold roboto"
          onClick={() => history.replace('/products')}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  switch (memory.loadingStatus) {
    case apiStatusConstants.success:
      return (
        <>
          <Header />
          {upperRender()}
          {lowerRender()}
        </>
      )

    case apiStatusConstants.inProgress:
      return (
        <>
          <Header />
          {loaderRender()}
        </>
      )
    case apiStatusConstants.failure:
      return (
        <>
          <Header /> {failureRender()}
        </>
      )

    default:
      return null
  }
}

export default ProductItemDetails
