import React from 'react'
import FaqItem from './FaqItem'
import { FaqData } from '@/model/mockData'

const FaqList = () => {
  return (
    <div>
    {FaqData.map((faq, faqIndex) => (
      <FaqItem key={faqIndex} heading={faq.heading} items={faq.qaList} />
    ))}
    
  </div>
  )
}

export default FaqList