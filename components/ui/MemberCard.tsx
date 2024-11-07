import Image from 'next/image'
import React from 'react'
import CareJunior from '@/public/assets/images/Membership/Care Junior.png'


const MemberCard = () => {
  return (
    <div>
        <Image src={CareJunior} alt="Care Junior"/>
        <div>
            <h3>Care Junior</h3>
        </div>
    </div>
  )
}

export default MemberCard