import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'


export default function DashboardMainView() {

    useEffect(() => {
        AOS.init({
            duration: 1500,
            once:true
        })
    })

    return (
        <>
            <section className='mb-10'>
                <h1 data-aos="fade-down"
                    data-aos-easing="linear"
                    data-aos-duration="1500" className="text-5xl text-gray-800 text-center font-bold ">¡Bienvenido!</h1>
            </section>

        </>
    )
}
