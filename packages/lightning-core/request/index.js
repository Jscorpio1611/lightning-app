
import React from 'react'
import { Form } from 'lightning-forms'
import { actions as popupActions } from 'lightning-popup'
import { store } from 'lightning-store'
import { connect } from 'react-redux'
import { actions as notificationActions } from 'lightning-notifications'
import { actions } from './reducer'
import { actions as paymentActions } from '../reducers/payment'
import { CurrencyInput, Head, Input, Page } from '../common'
import PaymentRequestPopup, { POPUP_NAME } from './PaymentRequestPopup'
import BitcoinWallet from './BitcoinWallet'

export const Pay = ({ showPopup, closePopup, paymentRequest, address,
  onFetchAddress, onGeneratePaymentRequest, onSuccess }) => {
  const fields = [
    {
      name: 'amount',
      placeholder: 'Amount',
      required: true,
      component: CurrencyInput,
    },
    {
      name: 'note',
      placeholder: 'Note',
      component: Input,
    },
  ]

  const handleSuccess = ({ amount, note }, clear) => {
    onGeneratePaymentRequest({ amount, note })
    showPopup(POPUP_NAME)
    clear()
  }

  const handleError = (errors) => {
    console.log('error', errors)
  }

  const handleClosePopup = (...args) => {
    closePopup(...args)
    onSuccess('Copied to Clipboard')
  }

  const styles = {
    wrap: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  }

  return (
    <div style={ styles.wrap }>
      <Page>
        <PaymentRequestPopup
          paymentRequest={ paymentRequest }
          closePopup={ handleClosePopup }
        />

        <Head
          title="Request Lightning Payment"
          body="Generate a payment request that others can use to pay you
          immediately via the Lightning Network."
        />
        <Form
          name="request"
          fields={ fields }
          submitLabel="Generate Payment Request"
          clearLabel="Cancel"
          onSuccess={ handleSuccess }
          onError={ handleError }
        />
      </Page>
      <BitcoinWallet
        address={ address }
        onSuccess={ onSuccess }
        onFetchAddress={ onFetchAddress }
      />
    </div>
  )
}

export default connect(
  state => ({
    paymentRequest: store.getPaymentRequest(state),
    address: store.getAddress(state),
  }), {
    showPopup: popupActions.onOpen,
    closePopup: popupActions.onClose,
    changePR: paymentActions.changeGeneratedPaymentRequest,
    onFetchAddress: actions.fetchAddress,
    onGeneratePaymentRequest: actions.generatePaymentRequest,
    onSuccess: notificationActions.addNotification,
  }
)(Pay)

export { default as reducer, actions, selectors } from './reducer'