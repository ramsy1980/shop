import React from 'react';
import { Nav } from "react-bootstrap"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import styled from 'styled-components';
import io from "socket.io-client";
import { CartIconAttrs } from '../types';

const ENDPOINT = "wss://shop-dev.ramsy.dev";

const CartBadge = styled.span`
    position: relative;
    bottom: 10px;
    right: 15px;
`

class CartIcon extends React.Component<CartIconAttrs['props'], CartIconAttrs['state']> {

    socket: SocketIOClient.Socket | undefined = undefined;

    constructor(props) {
        super(props)

        this.state = {
            products: this.props.cart?.products || []
        }
    }

    componentDidMount() {
        console.log('Cart mounted', this.props.cart.id)

        this.socket = io(ENDPOINT, {
            transports: ['websocket']
        });

        const cartId = this.props.cart.id;

        if (cartId) {
            console.log('Listening for cart changes', cartId)

            this.socket.on(cartId, data => {
                console.log("Received cart changes", data)

                this.setState({
                    products: data
                })
            });
        }
    }

    componentWillUnmount() {
        this.socket!.disconnect()
    }

    render() {

        let count = this.state.products.length

        return (
            <Nav>
                <Link href="/cart">
                    <a>
                        <FontAwesomeIcon
                            icon={faShoppingBag}
                            size="2x"
                            className="ml-2 mr-2 text-warning"
                        />
                        <CartBadge className="badge badge-dark">
                            {count}
                        </CartBadge>
                    </a>
                </Link>
            </Nav>
        )
    }
}

export default CartIcon