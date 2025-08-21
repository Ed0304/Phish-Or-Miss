import { useEffect, useState } from 'react';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import '../../App.css';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const phishingEmails = [
  {
    subject: 'Action Required: Unusual login detected',
    sender: 'security-alert@micros0ft-support.com',
    body: 'Your account was accessed from a new device. <a href="[[LINK]]" class="fake-link">Review activity</a> immediately.',
    link: 'http://micros0ft-support-alerts.com/login'
  },
  {
    subject: 'Congratulations! You are selected for a $500 Shopee voucher!',
    sender: 'promo@shopee-bigwin.biz',
    body: 'Claim your prize by clicking <a href="[[LINK]]" class="fake-link">here</a>.',
    link: 'http://shopee-voucher-online.com'
  },
  {
    subject: 'Important: Your Netflix subscription has expired',
    sender: 'no-reply@netfliix-support.com',
    body: 'Renew your payment info to avoid suspension: <a href="[[LINK]]" class="fake-link">Renew now</a>',
    link: 'http://netflix-billing-fix.me'
  },
  {
    subject: 'Apple ID locked for suspicious activity',
    sender: 'apple@security.com',
    body: 'Your Apple ID has been locked. <a href="[[LINK]]" class="fake-link">Unlock account</a>.',
    link: 'http://apple-id-verification.tech'
  },
  {
    subject: 'PayNow transaction alert',
    sender: 'noreply@ocbc.com.sg',
    body: 'A $1,000 transaction was attempted. <a href="[[LINK]]" class="fake-link">Cancel it now</a> if unauthorized.',
    link: 'http://ocbc-safe-pay-alert.info'
  },
  {
    subject: 'Urgent: Tax Refund Notification',
    sender: 'irash@taxgov-sg.org',
    body: 'You are eligible for a tax refund. <a href="[[LINK]]" class="fake-link">Submit info</a>.',
    link: 'http://gov-tax-refund.net'
  },
  {
    subject: 'Instagram Copyright Violation Notice',
    sender: 'copyright@instagrem.org',
    body: 'Your account will be suspended. <a href="[[LINK]]">Appeal now</a>.',
    link: 'http://insta-verify-dm.net'
  },
  {
    subject: 'Your DHL Package is on Hold',
    sender: 'noreply@dhl-package-alerts.com',
    body: 'A delivery attempt was failed. Confirm your address and schedule a new delivery: <a href="[[LINK]]" class="fake-link">Manage Delivery</a>.',
    link: 'http://dhl-tracking-confirm.info'
  },
  {
    subject: 'Your LinkedIn profile was viewed by a recruiter',
    sender: 'notifications@linkedin-jobs.net',
    body: 'A headhunter from a top firm viewed your profile. <a href="[[LINK]]" class="fake-link">See who it was</a>.',
    link: 'http://linkedin-premium-upgrade.co'
  },
  {
    subject: 'Suspicious Activity on Your Google Account',
    sender: 'google-security-noreply@account-alerts.com',
    body: 'A new sign-in from Windows device. If this wasn’t you, <a href="[[LINK]]" class="fake-link">secure your account now</a>.',
    link: 'http://google-account-review.biz'
  },
  {
    subject: 'Your Amazon Order Could Not Be Shipped',
    sender: 'shipment-issues@amazon-online.store',
    body: 'We encountered a problem with your payment method. <a href="[[LINK]]" class="fake-link">Update your details here</a> to receive your order.',
    link: 'http://amazon-payment-verification.cc'
  },
  {
    subject: 'Your WhatsApp Security Code Has Changed',
    sender: 'alert@whatsapp-support.org',
    body: 'For your security, verify your identity to continue using WhatsApp. <a href="[[LINK]]" class="fake-link">Verify Now</a>.',
    link: 'http://wa-me-verification.xyz'
  },
  {
    subject: 'Your Microsoft 365 Subscription is Expired',
    sender: 'billing@microsoft-office365.com',
    body: 'Your access to Word, Excel, and Outlook will be suspended. <a href="[[LINK]]" class="fake-link">Renew your subscription</a> to avoid disruption.',
    link: 'http://office365-renew-now.info'
  },
  {
    subject: 'You have a new Voicemail message',
    sender: 'alert@your-phone-carrier.com',
    body: 'Click to listen to your new voicemail: <a href="[[LINK]]" class="fake-link">Play Message</a>.',
    link: 'http://voicemail-access.net'
  },
  {
    subject: 'Your PDF Document is Ready',
    sender: 'documents@fileshare-portal.com',
    body: 'Please find the attached invoice for your recent purchase. <a href="[[LINK]]" class="fake-link">Download PDF</a>.',
    link: 'http://secure-document-download.me'
  },
  {
    subject: 'Action Required: Quarantined Message',
    sender: 'admin@email-system-protection.com',
    body: 'Your email system blocked a message sent to you. <a href="[[LINK]]" class="fake-link">Release the message</a> if you are expecting it.',
    link: 'http://mail-admin-portal.tech'
  },
  {
    subject: 'Your Facebook Page has received a Copyright Claim',
    sender: 'copyright@face-book-support.com',
    body: 'Your page risks being unpublished. <a href="[[LINK]]" class="fake-link">Appeal the claim</a> within 24 hours.',
    link: 'http://fb-page-appeal.com'
  },
  {
    subject: 'Your Wi-Fi Bill is Overdue',
    sender: 'accounts@myrepublic-billings.com',
    body: 'Your internet service will be disconnected today. <a href="[[LINK]]" class="fake-link">Make a payment immediately</a> to avoid suspension.',
    link: 'http://myrepublic-paybill.online'
  },
  {
    subject: 'Your Spotify Premium is Now Free for 3 Months!',
    sender: 'offers@spotify-promotions.club',
    body: 'You’ve been selected for an exclusive offer. No payment needed. <a href="[[LINK]]" class="fake-link">Claim Your Free Months</a>.',
    link: 'http://spotify-gift-premium.live'
  },
  {
    subject: 'Your iCloud Storage is Full',
    sender: 'support@icloud-alerts.me',
    body: 'You can no longer receive emails or back up your photos. <a href="[[LINK]]" class="fake-link">Upgrade your storage plan</a>.',
    link: 'http://icloud-storage-upgrade.pro'
  },
  {
    subject: 'Your GrabPay account has been credited',
    sender: 'notification@grabpay-rewards.com',
    body: 'You have received a $10 cashback reward. <a href="[[LINK]]" class="fake-link">Click to accept</a> and add it to your wallet.',
    link: 'http://grabpay-wallet-claim.com'
  },
  {
    subject: 'Your Zoom Account has been suspended',
    sender: 'admin@zoom-us.security',
    body: 'Due to unusual activity, your account is temporarily locked. <a href="[[LINK]]" class="fake-link">Verify your identity</a> to restore access.',
    link: 'http://zoom-account-reactivation.net'
  },
  {
    subject: 'You have been tagged in 5 new photos',
    sender: 'updates@instagram-photos.org',
    body: 'Your friends have tagged you in new pictures. <a href="[[LINK]]" class="fake-link">View your tags</a>.',
    link: 'http://instagram-tag-notice.com'
  },
  {
    subject: 'Your PayPal payment to "Steam" was declined',
    sender: 'receipts@paypal-billing.info',
    body: 'We declined a charge of $59.99 due to suspicious merchant activity. <a href="[[LINK]]" class="fake-link">Review this transaction</a>.',
    link: 'http://paypal-secure-transaction.com'
  },
  {
    subject: 'Your Google Drive is Over Quota',
    sender: 'storage@drive-google.com',
    body: 'You can no longer upload or edit files. <a href="[[LINK]]" class="fake-link">Increase your storage</a> or free up space.',
    link: 'http://google-drive-manage-storage.biz'
  },
  {
    subject: 'Your Raffles Medical eMedical Report',
    sender: 'noreply@raffles-medical-eservice.com',
    body: 'Your recent health screening report is ready for download. <a href="[[LINK]]" class="fake-link">Access your report</a>.',
    link: 'http://raffles-medical-ereport.com'
  },
  {
    subject: 'Your SingPass login from a new browser',
    sender: 'alert@singpass-notice.gov.sg',
    body: 'We noticed a new login attempt. If this was you, no action is needed. If not, <a href="[[LINK]]" class="fake-link">secure your account</a>.',
    link: 'http://singpass-account-review.xyz' // Note: Uses .xyz, a red flag for a gov.sg service.
  }
];

const legitEmails = [
  {
    subject: 'Your SIM-UOW exam timetable is now available',
    sender: 'student.services@sim.edu.sg',
    body: 'Access your personalized exam schedule here: <a href="[[LINK]]">View timetable</a>.',
    link: 'https://student.sim.edu.sg/portal/exams'
  },
  {
    subject: 'Weekly Cybersecurity Newsletter - August Edition',
    sender: 'newsletter@cybersecure.org',
    body: 'Check out the top 10 breaches this month and how to protect yourself: <a href="[[LINK]]">Read more</a>.',
    link: 'https://cybersecure.org/newsletter/august'
  },
  {
    subject: 'AWS Free Tier Usage Alert',
    sender: 'billing@aws.amazon.com',
    body: 'Your usage is close to the free-tier limit. <a href="[[LINK]]">Review your billing</a>.',
    link: 'https://aws.amazon.com/billing'
  },
  {
    subject: 'Course feedback survey',
    sender: 'admin@uowmail.edu.au',
    body: 'Tell us how we did this semester. <a href="[[LINK]]">Submit feedback</a>.',
    link: 'https://moodle.uow.edu.au/survey/form123'
  },
  {
    subject: 'Thank you for attending our workshop!',
    sender: 'events@techcareer.org',
    body: 'Access your certificate here: <a href="[[LINK]]">Download certificate</a>.',
    link: 'https://techcareer.org/events/certificates'
  },
  {
    subject: 'UOW Graduation Ceremony Details',
    sender: 'admin@uowmail.edu.au',
    body: 'Your graduation details are available. <a href="[[LINK]]">View schedule</a>.',
    link: 'https://student.uow.edu.au/graduation'
  },
  {
    subject: 'Your GitHub Copilot subscription is active',
    sender: 'noreply@github.com',
    body: 'Thanks for subscribing. <a href="[[LINK]]">Manage subscription</a>.',
    link: 'https://github.com/subscription'
  },
  {
    subject: 'Your statement is ready',
    sender: 'noreply@eml.dbs.com',
    body: 'Your DBS/POSB e-Statement for August 2024 is now available for download. <a href="[[LINK]]">View your statement</a>.',
    link: 'https://internet-banking.dbs.com.sg/estatement'
  },
  {
    subject: 'Your receipt from Grab',
    sender: 'receipt@grab.com',
    body: 'Thanks for riding with Grab. Your receipt for trip #GR123456 is ready. <a href="[[LINK]]">Download receipt</a>.',
    link: 'https://help.grab.com/rider-receipt/GR123456'
  },
  {
    subject: 'Please confirm your subscription',
    sender: 'updates@medium.email',
    body: 'Click the link below to confirm your subscription to the "Tech News Digest" newsletter. <a href="[[LINK]]">Confirm your email address</a>.',
    link: 'https://medium.com/confirm-subscription?token=abc123'
  },
  {
    subject: 'Your recent in-game purchase',
    sender: 'noreply@steampowered.com',
    body: 'Thank you for your purchase on Steam. <a href="[[LINK]]">View the details of your purchase</a> in your account history.',
    link: 'https://store.steampowered.com/account/history/'
  },
  {
    subject: 'Your upcoming appointment reminder',
    sender: 'appointments@smg.com.sg',
    body: 'This is a reminder for your appointment with Dr. Tan on Friday, 30 Aug 2024, at 3:00 PM. <a href="[[LINK]]">Manage your appointment</a>.',
    link: 'https://www.smg.com.sg/patient-portal/appointments'
  },
  {
    subject: 'A new device logged into your Twitter account',
    sender: 'info@account.x.com',
    body: 'A login from Chrome on Windows in Singapore, SG. If this was you, you can ignore this message. <a href="[[LINK]]">See more details here</a>.',
    link: 'https://x.com/settings/security'
  },
  {
    subject: 'Your food delivery is on its way!',
    sender: 'order-update@foodpanda.sg',
    body: 'Driver Lim is on the way with your order from McDonald’s. Expected arrival: 12:25 PM. <a href="[[LINK]]">Track your order</a>.',
    link: 'https://www.foodpanda.sg/track-order/ORD123456'
  },
  {
    subject: 'Your Google One storage update',
    sender: 'google-one-noreply@google.com',
    body: 'Your Google One membership gives you 100 GB of storage for your account. <a href="[[LINK]]">Manage storage</a>.',
    link: 'https://one.google.com/storage/manage'
  },
  {
    subject: 'Your recent in-game purchase',
    sender: 'no-reply@epicgames.com',
    body: 'Thanks for your purchase! A receipt for your recent Epic Games Store purchase has been issued. <a href="[[LINK]]">View Receipt</a>.',
    link: 'https://www.epicgames.com/account/transactions'
  },
  {
    subject: 'Your monthly Spotify Wrapped is here',
    sender: 'spotify@email.spotify.com',
    body: 'Ready to see your top artists and songs this month? <a href="[[LINK]]">See your monthly stats</a>.',
    link: 'https://open.spotify.com/wrapped-monthly'
  },
  {
    subject: 'Library book due soon',
    sender: 'noreply@publiclibrarysg.org',
    body: 'This is a reminder that your borrowed item "The Seven Moons of Maali Almeida" is due in 2 days. <a href="[[LINK]]">Renew your loans</a>.',
    link: 'https://www.nlb.gov.sg/mylibrary/loans'
  },
  {
    subject: 'Your Canva Design is ready to download',
    sender: 'notifications@canva.com',
    body: 'The video you created, "Company Overview", has finished processing. <a href="[[LINK]]">Download your design</a>.',
    link: 'https://www.canva.com/design/ABC123/view'
  },
  {
    subject: 'Your recent purchase at IKEA',
    sender: 'e-receipt@ikea.com.sg',
    body: 'Thank you for shopping at IKEA Alexandra. Your e-receipt is attached. <a href="[[LINK]]">View your IKEA Family points balance</a>.',
    link: 'https://www.ikea.com.sg/profile/points'
  },
  {
    subject: 'Your recent transaction at SHELL',
    sender: 'do-not-reply@shell.com',
    body: 'You spent S$68.50 at Shell Station (Alexandra Rd). 50 Go+ points have been added to your account. <a href="[[LINK]]">View your statement</a>.',
    link: 'https://www.shell.com.sg/go-plus/activity'
  },
  {
    subject: 'Your feedback is important to us',
    sender: 'no-reply@surveys.lazada.sg',
    body: 'How was your recent shopping experience? Tell us about it. <a href="[[LINK]]">Take a short survey</a>.',
    link: 'https://survey.lazada.sg/customer-feedback/order-123456'
  },
  {
    subject: 'Your requested video is ready to watch',
    sender: 'noreply@netflix.com',
    body: '"Avatar: The Last Airbender" (2024) is now available. <a href="[[LINK]]">Watch now</a>.',
    link: 'https://www.netflix.com/watch/80175722'
  },
  {
    subject: 'Your flight is coming up soon',
    sender: 'noreply@trip.com',
    body: 'Your flight SQ912 to Bangkok (BKK) is in 2 days. Check in online now. <a href="[[LINK]]">Manage your booking</a>.',
    link: 'https://www.trip.com/flights/manage-booking/'
  },
  {
    subject: 'Your electricity e-bill is ready',
    sender: 'noreply@spgroup.com.sg',
    body: 'Your electricity bill for 1 Aug - 31 Aug is ready. Total amount due: S$78.90. <a href="[[LINK]]">View your bill</a>.',
    link: 'https://www.spgroup.com.sg/MyAccount/Billing'
  },
  {
    subject: 'Your booking confirmation with KLOOK',
    sender: 'confirmation@klook.com',
    body: 'Your booking for Universal Studios Singapore™ 1-Day Ticket is confirmed! <a href="[[LINK]]">View your voucher</a>.',
    link: 'https://www.klook.com/en-SG/activity/12345-us-sg/orders/'
  },
  {
    subject: 'A password was recently changed',
    sender: 'security@facebook.com',
    body: 'You recently changed your Facebook password. If this was you, you can safely ignore this email. If not, <a href="[[LINK]]">secure your account</a>.',
    link: 'https://www.facebook.com/help/1216349518398524'
  }
];

const GAME_DURATION = 120;



function GamePage() {
  const [emailList, setEmailList] = useState([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showLink, setShowLink] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const shuffledPhishing = [...phishingEmails].sort(() => 0.5 - Math.random());
    const shuffledLegit = [...legitEmails].sort(() => 0.5 - Math.random());

    const selectedPhishing = shuffledPhishing.slice(0, 5);
    const selectedLegit = shuffledLegit.slice(0, 5);

    const combined = [...selectedPhishing, ...selectedLegit]
      .sort(() => 0.5 - Math.random())
      .map((email, i) => ({
        ...email,
        id: `email-${i}`,
        body: email.body.replace('[[LINK]]', email.link),
        type: phishingEmails.includes(email) ? 'phishing' : 'legit',
      }));

    setEmailList(combined);
  }, []);

  useEffect(() => {
    if (isSubmitted || currentEmailIndex >= 10) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer('miss');
          return GAME_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEmailIndex, isSubmitted]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentEmailIndex < 10 && emailList.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentEmailIndex, emailList]);

  const handleAnswer = (userChoice) => {
    const currentEmail = emailList[currentEmailIndex];
    const answer = {
      emailId: currentEmail.id,
      subject: currentEmail.subject,
      sender: currentEmail.sender,
      body: currentEmail.body,
      correctType: currentEmail.type,
      userAnswer: userChoice,
      isCorrect: currentEmail.type === userChoice,
      timeTaken: GAME_DURATION - timeLeft,
    };

    setUserAnswers((prev) => [...prev, answer]);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setCurrentEmailIndex((prev) => prev + 1);
    setTimeLeft(GAME_DURATION);
    setShowLink(false);
    setIsSubmitted(false);
  };

  const handleViewResults = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: userAnswers,
          username: user.username
        })
      });

      const data = await res.json();
      navigate('/report', {
        state: {
          report: data,
          username: user.username
        }
      });
    } catch (err) {
      console.error('Error fetching report:', err);
    }
  };

  if (emailList.length === 0) return <div>Loading...</div>;

  if (currentEmailIndex >= 10) {
    return (
      <div className="game-summary">
        <h2>🎓 Game Over</h2>
        <p>See if you can spot through these fakes, <strong>{user?.username || 'Agent'}</strong>!</p>
        <button onClick={handleViewResults} className="results-btn" style={{ marginTop: '20px', padding: '12px 20px' }}>
          📊 See Your Results
        </button>
      </div>
    );
  }

  const currentEmail = emailList[currentEmailIndex];

  return (
    <>
      <HeaderBar gameInProgress={currentEmailIndex < 10} />

      <main className="email-game-container">
        <h1>📧 Email {currentEmailIndex + 1} of 10</h1>
        <div className="email-card">
          <p><strong>From:</strong> {currentEmail.sender}</p>
          <p><strong>Subject:</strong> {currentEmail.subject}</p>
          <p
            dangerouslySetInnerHTML={{ __html: currentEmail.body }}
            title={currentEmail.link}
            onMouseEnter={() => setShowLink(true)}
            onClick={(e) => e.preventDefault()}
          />
        </div>

        <p>⏳ Time Left: {timeLeft}s</p>

        {!isSubmitted ? (
          <div className="answer-buttons">
            <button className="phish-btn" onClick={() => handleAnswer('phishing')}>🚩 Phish</button>
            <button className="legit-btn" onClick={() => handleAnswer('legit')}>✅ Legit</button>
          </div>
        ) : (
          <div>
            <p>You selected: <strong>{userAnswers[userAnswers.length - 1]?.userAnswer}</strong></p>
            <button className="next-btn" onClick={handleNext}>Next Email ➡️</button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default GamePage;
