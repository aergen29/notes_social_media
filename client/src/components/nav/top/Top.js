import React from "react";
import './top.css'
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const Top = ({ title }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="top-nav-container">

        <Link to="/"><h1>NOTE</h1></Link>
        {title ? <><h3>{title}</h3></> : <></>}

      </motion.div>
    </>
  );
}
export default Top;