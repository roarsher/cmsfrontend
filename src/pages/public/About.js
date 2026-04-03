import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-richblack-900 text-white px-6 py-12 flex justify-center">
      <div className="max-w-5xl w-full">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-yellow-50 mb-6 text-center">
          About Bhagalpur College of Engineering
        </h1>

        {/* Intro */}
        <p className="text-richblack-200 text-lg leading-relaxed text-center mb-10">
          Bhagalpur College of Engineering (BCE), Bhagalpur is one of the premier
          engineering institutions of Bihar, committed to providing quality
          technical education and fostering innovation, research, and ethical
          values among students.
        </p>

        {/* College Info Sections */}
        <div className="space-y-8">

          {/* History */}
          <div className="bg-richblack-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-50 mb-3">
              History & Establishment
            </h2>
            <p className="text-richblack-300 leading-relaxed">
              Bhagalpur College of Engineering was established with the vision of
              strengthening technical education in the state of Bihar. The
              institute operates under the Department of Science & Technology,
              Government of Bihar, and is affiliated with Bihar Engineering
              University (BEU).
            </p>
          </div>

          {/* Vision */}
          <div className="bg-richblack-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-50 mb-3">
              Vision
            </h2>
            <p className="text-richblack-300 leading-relaxed">
              To become a center of excellence in engineering education by
              nurturing competent professionals, innovators, and responsible
              citizens who contribute to national and global development.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-richblack-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-50 mb-3">
              Mission
            </h2>
            <ul className="list-disc list-inside text-richblack-300 space-y-2">
              <li>Provide quality technical education with strong fundamentals.</li>
              <li>Promote research, innovation, and industry interaction.</li>
              <li>Develop ethical values, leadership, and teamwork skills.</li>
              <li>Encourage lifelong learning and professional growth.</li>
            </ul>
          </div>

          {/* Departments */}
          <div className="bg-richblack-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-50 mb-3">
              Academic Departments
            </h2>
            <p className="text-richblack-300 mb-3">
              The institute offers undergraduate programs in the following
              engineering disciplines:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-richblack-300">
              <li>• Computer Science & Engineering</li>
              <li>• Mechanical Engineering</li>
              <li>• Electrical Engineering</li>
              <li>• Civil Engineering</li>
              <li>• Electronics and Communication Engineering</li>
            </ul>
          </div>

          {/* ERP Context */}
          <div className="bg-richblack-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-50 mb-3">
              About This ERP System
            </h2>
            <p className="text-richblack-300 leading-relaxed">
              The College Management System (ERP) is designed to digitalize and
              integrate academic and administrative processes such as student
              management, faculty records, attendance, examinations, fees, and
              communication, ensuring transparency and efficiency across the
              institution.
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-richblack-400 text-sm text-center mt-12">
          © 2026 Bhagalpur College of Engineering | College Management System
        </p>

      </div>
    </div>
  );
}

export default About;
