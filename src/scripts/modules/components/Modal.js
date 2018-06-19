import React from 'react';

export default class Modal extends React.Component {
    constructor() {
        super()
        this.events = this.events.bind(this);
        this.state = {
            visited: false
        }
    }

    componentDidMount() {
        this.modal = document.querySelector('.modal');
        this.modalInner = document.querySelector('.modal__inner');
        this.modalCloseButton = document.querySelector('.modal__close');
        this.events();

    }

    events() {
        this.modal.addEventListener('click', ((event) => {
            if (event.target === this.modal) {
                this.setState({ visited: true })
            }
        }));
        this.modalCloseButton.addEventListener('click', (() => {
            this.setState({ visited: true })
        }))

        // this.modalCloseButton.addEventListener('click', this.setState({ visited: true }));
    }

    render() {
        if (!this.state.visited) {
            return (
                <div className="modal">
                    <div className="modal__inner">
                        <span className='modal__close'>&#10006;</span>
                        <div className="modal__info">
                            <h3>Welcome!</h3>
                            <p>Due to the nature of this app being completely client side(and hosted on github), the majority of Binance data is currently being routed through a cors proxy. I recommend installing and enabling this extension <a href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en">Found here</a> and checking the "Cors Extension" button in the upper right hand corner for optimal performance. Otherwise, the app should still function for a brief period until the cors proxy starts rejecting our calls due to too many attempts. Thanks!</p>
                            <p>Note: The cors extension may interfere with other sites, so remember to disable extension when not using this app.</p>
                        </div>
                    </div>
                </div>
            )
        }
        return null;
    }
}

