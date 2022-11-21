import { useEffect, useState } from "react"
import "./Tickets.css"

export const TicketList = () => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false)



    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            if(emergency){
                const emergencyTickets = tickets.filter( ticket => ticket.emergency === true)
                setFiltered(emergencyTickets)
            }
            else{
                setFiltered(tickets)
            }
        }, [emergency]
    )

    useEffect(
        () => {
            fetch('http://localhost:8088/serviceTickets')        //get the tickets
                .then(response => response.json())               //convert the gotten code to js
                .then ((ticketArray) => { setTickets(ticketArray) })
        },
        [] // When this array is empty, you are observing initial component state
    )

    useEffect (
        () => {
            if(honeyUserObject.staff){ // for employees
                setFiltered(tickets)
            }
            else{                      // for customers
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
        },
        [tickets]
    )
    return <>

        { honeyUserObject.staff?
            <>
            <button onClick={()=> setEmergency(true)}>emergency Only</button>
            <button onClick={()=> setEmergency(false)}>show all</button>
            </>
            : ""
        }
        <h2>List of Tickets</h2>
 
        <article className="tickets">
            {
                filteredTickets.map(
                    (ticket) => {
                        return <section className="ticket" key={`ticket--${ticket.id}`}>
                            <header>{ticket.description}</header>
                            <footer>Emergency: {ticket.emergency ? "boom" : "No"}</footer>
                        </section>
                    }
                )
            }
        </article>
    </>
    
}

