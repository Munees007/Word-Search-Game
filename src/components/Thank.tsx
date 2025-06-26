

const Thank = () =>{
    return(
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
  <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
    <h2 className="text-2xl font-semibold mb-4">Thank You for Participating!</h2>
    <p className="mb-4">Dear Participants,</p>
    <p className="mb-4">
      Thank you for being a part of the Word Wizard game event! We hope you enjoyed the puzzles, challenges, and the overall experience.
    </p>
    <h3 className="text-xl font-semibold mb-2">Credits</h3>
    <p className="mb-4">
      This event was proudly organized by the <span className="font-medium">Softech Association</span> and the students of <span className="font-medium">I MCA</span>. We express our sincere gratitude to the faculty and department for their continuous support and encouragement in making this event a success.
    </p>
    <p>We appreciate your enthusiasm and active participation. Looking forward to seeing you in future events!</p>
    <p className="mt-4">Best regards,<br /> Softech Association<br /> Department of Computer Applications</p>
  </div>
</div>

    )
}

export default Thank;