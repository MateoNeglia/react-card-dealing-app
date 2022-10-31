import React, { Component } from 'react';
import Card from './Card';
import '../styles/Deck.css'
import axios from 'axios';


const API_BASE_URL = 'https://www.deckofcardsapi.com/api/deck';

class Deck extends Component {
    constructor(props) {
        super(props);
        this.state = {deck: null, drawn: [], isLoading: false};
        this.handleCard = this.handleCard.bind(this);
    }    
    //this is going to be called after the constructor runs and after the first render
    async componentDidMount() {
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle/` );
        this.setState({deck: deck.data});
    }

    async handleCard() {        
        let id= this.state.deck.deck_id;
        this.setState(state => ({
            isLoading: true,
        }));
        try {
            let cardUrl = `${API_BASE_URL}/${id}/draw`
            let cardRes = await axios.get(cardUrl);    
            if(!cardRes.data.success) {
                throw new Error('no cards left');
            }
            let card = cardRes.data.cards[0];
            this.setState(st =>  ({
                drawn: [
                    ...st.drawn,
                    {
                        id: card.code,
                        image: card.image,
                        name: `${card.suit}-${card.value}`
                    }
                ],
                    isLoading: false,
            }))
            console.log(cardRes.data);
        } catch (error) {
            alert(error)
        }
        
        
    }

    render() {
        let cards = this.state.drawn.map(card => (
            <Card key={card.id} name={card.name} image={card.image} />
        ))
        if(!this.state.isLoading) {
            return(
                <div>
                    <h1 className="deck-title">Click to deal a new card!</h1>
                    <button onClick={this.handleCard} className="hit-button">Hit!</button>
                    <div className="deck-placement">{cards}</div>
                
                </div>
            )
        } else {
            return(
                <div>
                    <h1 className="deck-title">Click to deal a new card!</h1>
                    <button onClick={this.handleCard} className="hit-button">Hit!</button>
                    <div>Getting new card...</div>                
                </div>
            )
        }      
            
        
    }

}

export default Deck;