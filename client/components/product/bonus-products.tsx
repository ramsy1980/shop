import { ProductRow, ProductDiv, ProductArticle, ProductFigure, ProductImage, PriceRow, PriceEuro, PriceSeperator, PriceCents, CircleButton, ProductTitle } from "./styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useRequest from '../../hooks/use-request';
import { useRouter } from "next/router";

export default ({ products, currentUser }) => {

    const router = useRouter();

    const { doRequest, errors } = useRequest({
        url: '/api/cart',
        method: 'post',
        body: {  },
        onSuccess: (result) => console.log('Added Product', result)
    });

    const hasProducts = products.length > 0;

    const onAddProduct = (product: {id: string, price: number}) => {
        doRequest({product: {id: product.id, price: product.price}})
    }

    if (!hasProducts) return null;

    return (
        <ProductRow>
            {
                products.map(product => {
                    const price = product.price.toFixed(2).split(".");

                    const [euro, cents] = price;

                    return (
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3" key={product.id}>
                            <ProductDiv>
                                <ProductArticle>
                                    <ProductFigure>
                                        <ProductImage
                                            className="img-fluid"
                                            src={product.imageUrl}
                                            alt={product.title}
                                        />
                                    </ProductFigure>
                                    <PriceRow>
                                        <PriceEuro>{euro}</PriceEuro>
                                        <PriceSeperator>▪</PriceSeperator>
                                        <PriceCents>{cents}</PriceCents>
                                    </PriceRow>
                                    <CircleButton
                                        className="btn btn-warning btn-circle"
                                        onClick={() => onAddProduct(product)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </CircleButton>
                                    <ProductTitle>
                                        {product.title}
                                    </ProductTitle>
                                </ProductArticle>
                            </ProductDiv>
                            {errors}
                        </div>
                    )
                })
            }
        </ProductRow>
    )
}