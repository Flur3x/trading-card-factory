import { SET_OWN_CARDS } from './mutation-types'
import web3 from '~/plugins/web3'
import TruffleContract from 'truffle-contract'
import CardsAbi from '../../build/contracts/Cards.json'
const cardsContract = TruffleContract(CardsAbi)

console.log('web3 instance', web3)

cardsContract.setProvider(web3.currentProvider)

export const state = () => ({
  ownCards: [],
})

export const mutations = {
  [SET_OWN_CARDS](state, cards) {
    state.ownCards = cards
  },
}

export const actions = {
  loadGenesisCard(ctx) {
    cardsContract
      .deployed()
      .then(instance => {
        return instance.getGenesisCard.call()
      })
      .then(card => {
        const cardObj = { title: card[0], attack: card[1].toNumber(), defense: card[2].toNumber(), creator: card[3] }

        ctx.commit('SET_OWN_CARDS', [cardObj])
      })
      .catch(e => {
        console.error('Could not load genesis card :(', e)
      })
  },
}

export const getters = {
  ownCards: state => state.ownCards,
}