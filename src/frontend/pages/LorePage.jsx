import '../../App.css'
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import mrphish from '../../assets/images/Mr-Phish.png';
import { motion } from 'framer-motion';

function Line({ text, delay = 0 }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      style={{
        fontSize: '1.25rem',
        marginBottom: '1.5rem',
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.7,
      }}
    >
      {text}
    </motion.p>
  );
}

function LorePage() {
  return (
    <>
      <HeaderBar />

      <main style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: 'auto',
        color: '#000'
      }}>

        {/* One line at a time reveal */}
        <Line text="In the not-so-distant future..." />
        <Line text="The world runs on speed." />
        <Line text="Decisions are instant. Attention spans? Gone in a blink." />
        <Line text="People trust anything that loads fast, signs in faster." />
        <Line text="Convenience has become the ultimate currency." />
        <Line text="And security... was left behind." />
        <Line text="But when everyone’s rushing—" />
        <Line text="—someone takes their time." />
        <Line text="Someone who doesn't need to break in..." />
        <Line text="Because you'll open the door yourself." />
        <Line text="You'll click the link. Download the file. Trust the illusion." />

        {/* Mr. Phish image reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ textAlign: 'center', margin: '3rem 0' }}
        >
          <img
            src={mrphish}
            alt="Mr. Phish"
            style={{
              width: '320px',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
              marginBottom: '1.5rem'
            }}
          />
        </motion.div>

        {/* Final reveal: his name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            color: '#d62828',
            marginBottom: '1rem'
          }}
        >
          🎩 Meet Mr. Phish.
        </motion.h2>

        <Line text="The con artist of the digital age." />
        <Line text="A silent trickster hiding behind fake emails and cloned logins." />
        <Line text="He doesn’t chase you." />
        <Line text="You come to him." />

        {/* Final dramatic hook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
            Can you spot the bait...
          </p>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>
            or will you get phished?
          </p>
        </motion.div>
      </main>

      <Footer />
    </>
  );
}

export default LorePage;
