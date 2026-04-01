// // src/pages/ApplyFormPage.jsx

// import { useState, useEffect, useRef, useCallback } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'

// // ─── CONFIG ───────────────────────────────────────────────────────────────────
// const PAYMENT_CONFIG = {
//   upiId: 'pranshushrivastav907-1@okaxis',
//   qrCodeUrl: '/qr-code.jpeg',
//   bankName: 'Punjab National Bank',
//   accountName: 'Pranshu Shrivastav',
//   accountNumber: '1887010007899',
//   ifscCode: 'PUNB0188720',
//   branch: 'Ranganj Bazar, Pratapgarh, UP - 230402',
// }

// const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

// // ─── Image Compressor ─────────────────────────────────────────────────────────
// function compressImage(file, maxWidth = 800, quality = 0.7) {
//   return new Promise((resolve) => {
//     if (file.type === 'application/pdf') {
//       const reader = new FileReader()
//       reader.onload = (e) => resolve({
//         base64: e.target.result.split(',')[1],
//         mimetype: file.type,
//         originalName: file.name,
//       })
//       reader.readAsDataURL(file)
//       return
//     }
//     const img = new Image()
//     const url = URL.createObjectURL(file)
//     img.onload = () => {
//       URL.revokeObjectURL(url)
//       const scale = Math.min(1, maxWidth / img.width)
//       const canvas = document.createElement('canvas')
//       canvas.width = img.width * scale
//       canvas.height = img.height * scale
//       const ctx = canvas.getContext('2d')
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
//       const dataUrl = canvas.toDataURL('image/jpeg', quality)
//       resolve({
//         base64: dataUrl.split(',')[1],
//         mimetype: 'image/jpeg',
//         originalName: file.name,
//       })
//     }
//     img.onerror = () => {
//       const reader = new FileReader()
//       reader.onload = (e) => resolve({
//         base64: e.target.result.split(',')[1],
//         mimetype: file.type,
//         originalName: file.name,
//       })
//       reader.readAsDataURL(file)
//     }
//     img.src = url
//   })
// }

// // ─── Toast ────────────────────────────────────────────────────────────────────
// function Toast({ message, type = 'error', onClose }) {
//   useEffect(() => { const t = setTimeout(onClose, 6000); return () => clearTimeout(t) }, [onClose])
//   const bg = type === 'error'
//     ? 'bg-red-50 border-red-200 text-red-800'
//     : type === 'success'
//       ? 'bg-green-50 border-green-200 text-green-800'
//       : 'bg-yellow-50 border-yellow-200 text-yellow-800'
//   return (
//     <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-sm w-[90vw] ${bg}`}>
//       <span className="text-base mt-0.5">{type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
//       <p className="text-sm leading-snug flex-1">{message}</p>
//       <button onClick={onClose} className="text-base opacity-60 hover:opacity-100 leading-none mt-0.5">✕</button>
//     </div>
//   )
// }

// function useToast() {
//   const [toasts, setToasts] = useState([])
//   const show = useCallback((message, type = 'error') => setToasts(p => [...p, { id: Date.now(), message, type }]), [])
//   const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), [])
//   const ToastContainer = (
//     <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center gap-2 pt-4 pointer-events-none">
//       {toasts.map(t => (
//         <div key={t.id} className="pointer-events-auto">
//           <Toast message={t.message} type={t.type} onClose={() => remove(t.id)} />
//         </div>
//       ))}
//     </div>
//   )
//   return { show, ToastContainer }
// }

// // ─── File Upload Field ────────────────────────────────────────────────────────
// function FileUpload({ label, name, accept, required, onChange, hint }) {
//   const [fileName, setFileName] = useState('')
//   const [preview, setPreview] = useState(null)
//   const inputRef = useRef()

//   const handleChange = (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     setFileName(file.name)
//     if (file.type.startsWith('image/')) {
//       const r = new FileReader()
//       r.onload = (ev) => setPreview(ev.target.result)
//       r.readAsDataURL(file)
//     } else {
//       setPreview(null)
//     }
//     onChange(name, file)
//   }

//   return (
//     <div>
//       <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">
//         {label} {required ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal ml-1">(Optional)</span>}
//       </label>
//       {hint && <p className="text-gray-400 text-xs mb-2">{hint}</p>}
//       <div onClick={() => inputRef.current.click()}
//         className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-pointer hover:border-[#1a5c2a] hover:bg-[#f0f7f0] transition-all flex items-center gap-3">
//         <span className="text-xl">📎</span>
//         <span className="flex-1 truncate">{fileName || 'Click to upload file'}</span>
//         <span className="text-xs text-[#4a9e5c] font-semibold shrink-0">Browse</span>
//       </div>
//       <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
//       {preview && (
//         <div className="mt-2 relative inline-block">
//           <img src={preview} alt="preview" className="h-20 w-20 object-cover rounded-lg border-2 border-[#4a9e5c]" />
//           <span className="absolute -top-1.5 -right-1.5 bg-[#1a5c2a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</span>
//         </div>
//       )}
//       {fileName && !preview && <p className="text-xs text-[#4a9e5c] mt-1.5 flex items-center gap-1"><span>✓</span> {fileName}</p>}
//     </div>
//   )
// }

// // ─── Step Bar ─────────────────────────────────────────────────────────────────
// function StepBar({ current }) {
//   const steps = ['Personal Details', 'Documents', 'Payment']
//   return (
//     <div className="flex items-center justify-center gap-0 mb-8">
//       {steps.map((step, i) => (
//         <div key={i} className="flex items-center">
//           <div className="flex flex-col items-center">
//             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
//               ${i < current ? 'bg-[#1a5c2a] border-[#1a5c2a] text-white' :
//                 i === current ? 'bg-[#f0c020] border-[#f0c020] text-[#1a5c2a]' :
//                   'bg-white border-gray-300 text-gray-400'}`}>
//               {i < current ? '✓' : i + 1}
//             </div>
//             <span className={`text-xs mt-1 font-semibold hidden sm:block ${i === current ? 'text-[#1a5c2a]' : 'text-gray-400'}`}>
//               {step}
//             </span>
//           </div>
//           {i < steps.length - 1 && (
//             <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-4 sm:mb-5 transition-all ${i < current ? 'bg-[#1a5c2a]' : 'bg-gray-200'}`} />
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

// function isEduRowFilled(row) {
//   return !!(row.rollEnroll || row.college || row.board || row.year || row.totalMarks || row.obtainMarks)
// }

// // ─── Copy Button ──────────────────────────────────────────────────────────────
// function CopyButton({ text }) {
//   const [copied, setCopied] = useState(false)
//   const copy = async () => {
//     try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch (_) { }
//   }
//   return (
//     <button onClick={copy} className="ml-2 text-xs bg-[#1a5c2a] text-white px-2 py-0.5 rounded-full hover:bg-[#2d7a3a] transition-all">
//       {copied ? '✓ Copied' : 'Copy'}
//     </button>
//   )
// }

// // ─── Payment Info Card ────────────────────────────────────────────────────────
// function PaymentInfoCard({ method, feeGeneral, feeOBC, category }) {
//   const amount = category === 'General' ? feeGeneral : feeOBC

//   if (method === 'UPI') {
//     return (
//       <div className="bg-[#f0f7f0] border border-[#4a9e5c] rounded-2xl p-4 mb-5">
//         <p className="text-[#1a5c2a] font-bold text-sm mb-3">📲 Pay via UPI</p>
//         <div className="flex flex-col items-center gap-5">
//           <div className="flex flex-col items-center gap-2">
//             <div className="w-52 h-52 bg-white border-2 border-[#1a5c2a] rounded-xl flex items-center justify-center overflow-hidden">
//               <img
//                 src={PAYMENT_CONFIG.qrCodeUrl}
//                 alt="UPI QR Code"
//                 className="w-full h-full object-contain"
//                 onError={(e) => {
//                   e.target.style.display = 'none'
//                   e.target.nextSibling.style.display = 'flex'
//                 }}
//               />
//               <div className="hidden w-full h-full flex-col items-center justify-center text-gray-400 text-xs text-center p-2">
//                 <span className="text-3xl mb-1">📷</span>
//                 <span>Add qr-code.jpeg to /public</span>
//               </div>
//             </div>
//             <span className="text-xs text-gray-500">Scan QR to pay</span>
//           </div>
//           <div className="flex-1 space-y-2 w-full">
//             <div className="bg-white rounded-xl px-4 py-2.5 border border-gray-200">
//               <p className="text-xs text-gray-400 mb-0.5">Receiver Name</p>
//               <span className="font-bold text-[#1a5c2a] text-sm">{PAYMENT_CONFIG.accountName}</span>
//             </div>
//             <div className="bg-white rounded-xl px-4 py-2.5 border border-gray-200">
//               <p className="text-xs text-gray-400 mb-0.5">UPI ID</p>
//               <div className="flex items-center">
//                 <span className="font-bold text-[#1a5c2a] text-sm">{PAYMENT_CONFIG.upiId}</span>
//                 <CopyButton text={PAYMENT_CONFIG.upiId} />
//               </div>
//             </div>
//             <div className="bg-[#fffdf0] border border-[#f0c020] rounded-xl px-4 py-2.5">
//               <p className="text-xs text-gray-400 mb-0.5">Amount to Pay</p>
//               <p className="font-bold text-[#1a5c2a] text-base">{amount}</p>
//             </div>
//             <p className="text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
//               💡 After payment, copy the <strong>Transaction ID / UTR</strong> from your UPI app and paste below.
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-[#f0f7f0] border border-[#4a9e5c] rounded-2xl p-4 mb-5">
//       <p className="text-[#1a5c2a] font-bold text-sm mb-3">🏦 Bank Transfer Details</p>
//       <div className="grid sm:grid-cols-2 gap-2 mb-3">
//         {[
//           { label: 'Account Name', value: PAYMENT_CONFIG.accountName },
//           { label: 'Account Number', value: PAYMENT_CONFIG.accountNumber },
//           { label: 'IFSC Code', value: PAYMENT_CONFIG.ifscCode },
//           { label: 'Bank Name', value: PAYMENT_CONFIG.bankName },
//           { label: 'Branch', value: PAYMENT_CONFIG.branch },
//         ].map(({ label, value }) => (
//           <div key={label} className="bg-white rounded-xl px-4 py-2.5 border border-gray-200">
//             <p className="text-xs text-gray-400 mb-0.5">{label}</p>
//             <div className="flex items-center">
//               <span className="font-bold text-[#1a5c2a] text-sm">{value}</span>
//               <CopyButton text={value} />
//             </div>
//           </div>
//         ))}
//         <div className="bg-[#fffdf0] border border-[#f0c020] rounded-xl px-4 py-2.5">
//           <p className="text-xs text-gray-400 mb-0.5">Amount to Transfer</p>
//           <p className="font-bold text-[#1a5c2a] text-base">{amount}</p>
//         </div>
//       </div>
//       <p className="text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
//         💡 After transfer, enter the <strong>UTR / Reference Number</strong> from your bank app below.
//       </p>
//     </div>
//   )
// }

// // ─── UTR Duplicate check ──────────────────────────────────────────────────────
// async function checkDuplicateUTR(utr) {
//   if (!APPS_SCRIPT_URL) return false
//   try {
//     const res = await fetch(`${APPS_SCRIPT_URL}?action=checkUTR&utr=${encodeURIComponent(utr)}`)
//     const data = await res.json()
//     return data.isDuplicate === true
//   } catch {
//     return false
//   }
// }

// // ─── Main Component ────────────────────────────────────────────────────────────
// export default function ApplyFormPage() {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const post = location.state?.post
//   const { show: showToast, ToastContainer } = useToast()

//   const [step, setStep] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [loadingMsg, setLoadingMsg] = useState('Processing...')
//   const [declarationChecked, setDeclarationChecked] = useState(false)
//   const [paymentMethod, setPaymentMethod] = useState('UPI')

//   const [payment, setPayment] = useState({
//     senderName: '',
//     senderUpiId: '',
//     transactionId: '',
//     paymentDate: '',
//     paymentTime: '',
//     accountHolderName: '',
//     lastFourDigits: '',
//     referenceNumber: '',
//     screenshotFile: null,
//     screenshotPreview: null,
//   })

//   const [form, setForm] = useState({
//     name: '',
//     fatherName: '',
//     motherName: '',
//     dob: '',
//     mobile: '',
//     email: '',
//     gender: '',
//     category: '',
//     nationality: 'Indian',
//     state: '',
//     district: '',
//     block: '',
//     pincode: '',
//     address: '',
//     qualification: '',
//     aadhar: '',
//     bankAccountNo: '',
//     bankIfsc: '',
//     bankName: '',
//   })

//   const [files, setFiles] = useState({
//     photo: null,
//     signature: null,
//     aadharDoc: null,
//     bankPassbook: null,
//     tenthDoc: null,
//     twelfthDoc: null,
//     qualificationDoc: null,
//     additionalDoc: null,
//   })

//   const [education, setEducation] = useState([
//     { class: '10th Class', rollEnroll: '', college: '', board: '', year: '', totalMarks: '', obtainMarks: '', percentage: '' },
//     { class: '12th Class', rollEnroll: '', college: '', board: '', year: '', totalMarks: '', obtainMarks: '', percentage: '' },
//   ])

//   const show10thDoc = isEduRowFilled(education[0])
//   const show12thDoc = isEduRowFilled(education[1])

//   useEffect(() => { if (!post) navigate('/posts', { replace: true }) }, [post, navigate])

//   const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
//   const handleFileChange = (name, file) => setFiles(p => ({ ...p, [name]: file }))
//   const handlePaymentChange = (e) => setPayment(p => ({ ...p, [e.target.name]: e.target.value }))

//   const handleEduChange = (i, field, value) => {
//     setEducation(prev => {
//       const updated = prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r)
//       if (field === 'obtainMarks' || field === 'totalMarks') {
//         const row = updated[i]
//         const total = parseFloat(field === 'totalMarks' ? value : row.totalMarks)
//         const obtain = parseFloat(field === 'obtainMarks' ? value : row.obtainMarks)
//         updated[i] = {
//           ...updated[i],
//           percentage: (total > 0 && obtain >= 0 && obtain <= total)
//             ? ((obtain / total) * 100).toFixed(2) : '',
//         }
//       }
//       return updated
//     })
//   }

//   const validateStep0 = () => {
//     const required = [
//       ['name', "Applicant's Full Name"],
//       ['fatherName', "Father's / Husband's Name"],
//       ['dob', 'Date of Birth'],
//       ['mobile', 'Mobile Number'],
//       ['email', 'Email Address'],
//       ['gender', 'Gender'],
//       ['category', 'Category'],
//       ['nationality', 'Nationality'],
//       ['state', 'State'],
//       ['district', 'District'],
//       ['block', 'Block'],
//       ['pincode', 'Pincode'],
//       ['address', 'Full Address'],
//       ['qualification', 'Educational Qualification'],
//       ['aadhar', 'Aadhar Card Number'],
//       ['bankAccountNo', 'Bank Account Number'],
//       ['bankIfsc', 'Bank IFSC Code'],
//       ['bankName', 'Bank Name'],
//     ]
//     for (const [key, label] of required) {
//       if (!form[key]?.trim()) { showToast(`Please fill in: ${label}`); return false }
//     }
//     if (!/^\d{12}$/.test(form.aadhar)) { showToast('Aadhar number must be exactly 12 digits'); return false }
//     if (!/^\d{10}$/.test(form.mobile)) { showToast('Mobile number must be exactly 10 digits'); return false }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { showToast('Please enter a valid email address'); return false }
//     if (!/^\d{6}$/.test(form.pincode)) { showToast('Pincode must be exactly 6 digits'); return false }
//     if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.bankIfsc.toUpperCase())) {
//       showToast('Enter a valid IFSC Code (e.g. SBIN0001234)'); return false
//     }
//     return true
//   }

//   const validateStep1 = () => {
//     if (!files.photo) { showToast('Please upload your Passport-size Photo'); return false }
//     if (!files.signature) { showToast('Please upload your Signature'); return false }
//     if (!files.aadharDoc) { showToast('Please upload your Aadhar Card document'); return false }
//     if (!files.bankPassbook) { showToast('Please upload your Bank Passbook'); return false }
//     if (show10thDoc && !files.tenthDoc) { showToast('Please upload your 10th Class Marksheet'); return false }
//     if (show12thDoc && !files.twelfthDoc) { showToast('Please upload your 12th Class Marksheet'); return false }
//     if (!declarationChecked) { showToast('Please read and accept the declaration'); return false }
//     return true
//   }

//   const validateStep2 = () => {
//     if (paymentMethod === 'UPI') {
//       if (!payment.senderName?.trim()) { showToast('Please enter Sender Name'); return false }
//       if (!payment.senderUpiId?.trim()) { showToast('Please enter your Sender UPI ID'); return false }
//       if (!payment.transactionId?.trim()) { showToast('Transaction ID is required'); return false }
//       if (!/^[a-zA-Z0-9_\-]{8,}$/.test(payment.transactionId.trim())) {
//         showToast('Enter a valid Transaction ID (min 8 characters)'); return false
//       }
//       if (!payment.paymentDate?.trim()) { showToast('Please enter Payment Date'); return false }
//       if (!payment.paymentTime?.trim()) { showToast('Please enter Payment Time'); return false }
//       if (!payment.screenshotFile) { showToast('Please upload payment screenshot'); return false }
//     } else {
//       if (!payment.accountHolderName?.trim()) { showToast('Please enter Account Holder Name'); return false }
//       if (!payment.lastFourDigits?.trim() || !/^\d{4}$/.test(payment.lastFourDigits)) {
//         showToast('Last 4 digits must be exactly 4 digits'); return false
//       }
//       if (!payment.referenceNumber?.trim()) { showToast('UTR / Reference Number is required'); return false }
//       if (!/^[a-zA-Z0-9_\-]{8,}$/.test(payment.referenceNumber.trim())) {
//         showToast('Enter a valid UTR / Reference Number (min 8 characters)'); return false
//       }
//       if (!payment.paymentDate?.trim()) { showToast('Please enter Payment Date'); return false }
//       if (!payment.paymentTime?.trim()) { showToast('Please enter Payment Time'); return false }
//       if (!payment.screenshotFile) { showToast('Please upload payment screenshot'); return false }
//     }
//     return true
//   }

//   // ─── Handle Final Submit ───────────────────────────────────────────────────
//   const handleFinalSubmit = async () => {
//     if (!validateStep2() || loading) return
//     setLoading(true)

//     const utr = paymentMethod === 'UPI'
//       ? payment.transactionId.trim()
//       : payment.referenceNumber.trim()

//     try {
//       // ── Step 1: UTR duplicate check ──
//       setLoadingMsg('Verifying transaction ID...')
//       const isDuplicate = await checkDuplicateUTR(utr)
//       if (isDuplicate) {
//         showToast('⚠️ Duplicate Transaction ID detected!', 'error')
//         setLoading(false)
//         return
//       }

//       // ── Step 2: Compress files ──
//       setLoadingMsg('Compressing & uploading documents...')
//       const [
//         photoObj, signatureObj, aadharDocObj,
//         bankPassbookObj, tenthDocObj, twelfthDocObj,
//         qualDocObj, addDocObj, screenshotObj,
//       ] = await Promise.all([
//         files.photo            ? compressImage(files.photo, 800, 0.75)            : Promise.resolve(null),
//         files.signature        ? compressImage(files.signature, 600, 0.80)        : Promise.resolve(null),
//         files.aadharDoc        ? compressImage(files.aadharDoc, 1200, 0.80)       : Promise.resolve(null),
//         files.bankPassbook     ? compressImage(files.bankPassbook, 1200, 0.80)    : Promise.resolve(null),
//         files.tenthDoc         ? compressImage(files.tenthDoc, 1200, 0.80)        : Promise.resolve(null),
//         files.twelfthDoc       ? compressImage(files.twelfthDoc, 1200, 0.80)      : Promise.resolve(null),
//         files.qualificationDoc ? compressImage(files.qualificationDoc, 1200, 0.80): Promise.resolve(null),
//         files.additionalDoc    ? compressImage(files.additionalDoc, 1200, 0.80)   : Promise.resolve(null),
//         payment.screenshotFile ? compressImage(payment.screenshotFile, 1000, 0.75): Promise.resolve(null),
//       ])

//       const uploadedFiles = {
//         photo:            photoObj,
//         signature:        signatureObj,
//         aadharDoc:        aadharDocObj,
//         bankPassbook:     bankPassbookObj,
//         tenthDoc:         tenthDocObj,
//         twelfthDoc:       twelfthDocObj,
//         qualificationDoc: qualDocObj,
//         additionalDoc:    addDocObj,
//         screenshot:       screenshotObj,
//       }

//       // ── Step 3: Backend call — registrationNo mat bhejo, backend generate karega ──
//       setLoadingMsg('Submitting application...')
//       const backendRes = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/verify-payment`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             // ✅ registrationNo nahi bhejte — backend khud generate karega
//             formData: {
//               ...form,
//               postTitle: post.title,
//               postLevel: post.level || '',
//               education: JSON.stringify(education),
//             },
//             paymentInfo: {
//               paymentMethod,
//               utrNumber: utr,
//               senderName:        paymentMethod === 'UPI'           ? payment.senderName        : '',
//               senderUpiId:       paymentMethod === 'UPI'           ? payment.senderUpiId       : '',
//               accountHolderName: paymentMethod === 'Bank Transfer' ? payment.accountHolderName : '',
//               lastFourDigits:    paymentMethod === 'Bank Transfer' ? payment.lastFourDigits    : '',
//               paymentDate:  payment.paymentDate,
//               paymentTime:  payment.paymentTime,
//               paymentStatus: 'Under Review',
//             },
//             uploadedFiles,
//           }),
//         }
//       )

//       if (!backendRes.ok) {
//         const errData = await backendRes.json().catch(() => ({}))
//         showToast(errData.error || 'Submission failed. Please try again.', 'error')
//         setLoading(false)
//         return
//       }

//       // ── Step 4: Backend se registrationNo lo ──
//       const result = await backendRes.json()
//       const registrationNo = result.registrationNo

//       if (!registrationNo) {
//         showToast('Registration number generate nahi hua. Please try again.', 'error')
//         setLoading(false)
//         return
//       }

//       const filename = `Application_${form.name.replace(/\s+/g, '_')}_${registrationNo}.pdf`

//       navigate('/success', {
//         state: {
//           name:          form.name,
//           post:          post.title,
//           pdfBase64:     result.pdfBase64 || null,
//           filename,
//           driveLink:     result.driveLink || null,
//           registrationNo,
//           paymentMethod,
//           utr,
//           paymentDate:   payment.paymentDate,
//           paymentTime:   payment.paymentTime,
//           paymentStatus: 'Under Review',
//         },
//       })

//     } catch (err) {
//       showToast(err.message || 'Submission failed. Please try again.', 'error')
//       setLoading(false)
//     }
//   }

//   const states = [
//     'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
//     'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
//     'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
//     'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
//     'Delhi', 'Jammu & Kashmir', 'Ladakh',
//   ]

//   if (!post) return null

//   const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a5c2a] transition-colors"
//   const sel = `${inp} bg-white`

//   return (
//     <main className="overflow-x-hidden">
//       {ToastContainer}

//       {/* Hero */}
//       <section className="bg-gradient-to-r from-[#1a5c2a] to-[#4a9e5c] py-12 md:py-16 text-center">
//         <div className="max-w-2xl mx-auto px-4">
//           <span className="text-[#f0c020] uppercase text-xs font-bold tracking-widest">{post.level} — Registration Form</span>
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">{post.title}</h1>
//           <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-[#f0c020]" />
//           <p className="text-green-100 text-sm mt-4">Age Limit: {post.ageLimit} &nbsp;|&nbsp; Fee: {post.feeGeneral} (Gen) / {post.feeOBC} (OBC/SC/ST)</p>
//         </div>
//       </section>

//       {/* Form */}
//       <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
//         <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
//           className="mb-6 text-[#1a5c2a] font-semibold text-sm flex items-center gap-2 hover:underline">
//           ← {step > 0 ? 'Previous Step' : 'Back to Posts'}
//         </button>

//         <StepBar current={step} />

//         <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border-b-4 border-[#f0c020]">

//           {/* Post badge */}
//           <div className="mb-6 bg-[#f0f7f0] rounded-2xl px-5 py-3 flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">Applying For</p>
//               <p className="text-[#1a5c2a] font-bold text-sm">{post.title}</p>
//             </div>
//             <span className="bg-[#f0c020] text-[#1a5c2a] text-xs font-bold px-3 py-1 rounded-full">{post.level}</span>
//           </div>

//           {/* ── STEP 0: Personal Details ── */}
//           {step === 0 && (
//             <>
//               <h3 className="text-[#1a5c2a] font-bold text-base mb-4 border-b-2 border-[#f0c020] pb-2">👤 Personal Details</h3>
//               <div className="grid sm:grid-cols-2 gap-4 mb-6">
//                 {[
//                   { label: "Applicant's Full Name",      name: 'name',       type: 'text', placeholder: 'Enter full name as per Aadhar' },
//                   { label: "Father's / Husband's Name",  name: 'fatherName', type: 'text', placeholder: "Enter father's or husband's name" },
//                   { label: "Mother's Name",              name: 'motherName', type: 'text', placeholder: "Enter mother's name" },
//                   { label: 'Date of Birth',              name: 'dob',        type: 'date' },
//                   { label: 'Aadhar Card Number',         name: 'aadhar',     type: 'text', maxLength: 12, placeholder: '12-digit Aadhar number' },
//                 ].map((f) => (
//                   <div key={f.name}>
//                     <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">{f.label} <span className="text-red-500">*</span></label>
//                     <input type={f.type} name={f.name} required maxLength={f.maxLength}
//                       placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} className={inp} />
//                   </div>
//                 ))}

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Gender <span className="text-red-500">*</span></label>
//                   <select name="gender" required value={form.gender} onChange={handleChange} className={sel}>
//                     <option value="">-- Select --</option>
//                     <option>Female</option><option>Male</option><option>Other</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Category <span className="text-red-500">*</span></label>
//                   <select name="category" required value={form.category} onChange={handleChange} className={sel}>
//                     <option value="">-- Select --</option>
//                     <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Nationality <span className="text-red-500">*</span></label>
//                   <select name="nationality" required value={form.nationality} onChange={handleChange} className={sel}>
//                     <option value="Indian">Indian</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Educational Qualification <span className="text-red-500">*</span></label>
//                   <select name="qualification" required value={form.qualification} onChange={handleChange} className={sel}>
//                     <option value="">-- Select --</option>
//                     <option>10th Pass</option><option>12th Pass</option><option>Other</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Education Table */}
//               <h3 className="text-[#1a5c2a] font-bold text-base mb-3 border-b-2 border-[#f0c020] pb-2">🎓 Education Details</h3>
//               <p className="text-gray-400 text-xs mb-3">Fill only the rows that apply to you.</p>
//               <div className="overflow-x-auto mb-6">
//                 <table className="w-full text-xs border-collapse">
//                   <thead>
//                     <tr className="bg-[#1a5c2a] text-white">
//                       {['Class', 'Roll/Enroll No.', 'College / School', 'Board / University', 'Year', 'Total Marks', 'Obtain Marks', '%'].map(h => (
//                         <th key={h} className="px-2 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {education.map((row, i) => (
//                       <tr key={i} className={i % 2 === 0 ? 'bg-[#f0f7f0]' : 'bg-white'}>
//                         <td className="px-2 py-1.5 font-semibold text-[#1a5c2a] whitespace-nowrap">{row.class}</td>
//                         {['rollEnroll', 'college', 'board', 'year', 'totalMarks', 'obtainMarks'].map(field => (
//                           <td key={field} className="px-1 py-1">
//                             <input type="text" value={row[field]}
//                               onChange={(e) => handleEduChange(i, field, e.target.value)}
//                               className="w-full border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#1a5c2a]"
//                               placeholder="—" />
//                           </td>
//                         ))}
//                         <td className="px-2 py-1.5 text-center font-bold text-[#1a5c2a]">{row.percentage || '—'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Contact Details */}
//               <h3 className="text-[#1a5c2a] font-bold text-base mb-4 border-b-2 border-[#f0c020] pb-2">📞 Contact Details</h3>
//               <div className="grid sm:grid-cols-2 gap-4 mb-6">
//                 {[
//                   { label: 'Mobile Number (10 digits)', name: 'mobile', type: 'tel',   maxLength: 10, placeholder: '10-digit mobile number' },
//                   { label: 'Email Address',             name: 'email',  type: 'email',               placeholder: 'your@email.com' },
//                 ].map(f => (
//                   <div key={f.name}>
//                     <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">{f.label} <span className="text-red-500">*</span></label>
//                     <input type={f.type} name={f.name} required maxLength={f.maxLength}
//                       placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} className={inp} />
//                   </div>
//                 ))}

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">State <span className="text-red-500">*</span></label>
//                   <select name="state" required value={form.state} onChange={handleChange} className={sel}>
//                     <option value="">-- Select State --</option>
//                     {states.map(s => <option key={s}>{s}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">District <span className="text-red-500">*</span></label>
//                   <input type="text" name="district" required value={form.district} onChange={handleChange}
//                     placeholder="Enter your district" className={inp} />
//                 </div>

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Block <span className="text-red-500">*</span></label>
//                   <input type="text" name="block" required value={form.block} onChange={handleChange}
//                     placeholder="Enter your block" className={inp} />
//                 </div>

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Pincode <span className="text-red-500">*</span></label>
//                   <input type="text" name="pincode" required maxLength={6} value={form.pincode} onChange={handleChange}
//                     placeholder="6-digit pincode" className={inp} />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Full Address <span className="text-red-500">*</span></label>
//                   <textarea name="address" required rows={3} value={form.address} onChange={handleChange}
//                     placeholder="Enter Your Full Address"
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a5c2a] transition-colors resize-none" />
//                 </div>
//               </div>

//               {/* Bank Details */}
//               <h3 className="text-[#1a5c2a] font-bold text-base mb-4 border-b-2 border-[#f0c020] pb-2">🏦 Bank Details</h3>
//               <div className="grid sm:grid-cols-2 gap-4 mb-6">
//                 <div className="sm:col-span-2">
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Bank Account Number <span className="text-red-500">*</span></label>
//                   <input type="text" name="bankAccountNo" required value={form.bankAccountNo} onChange={handleChange}
//                     placeholder="Enter your bank account number" className={inp} />
//                 </div>
//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">IFSC Code <span className="text-red-500">*</span></label>
//                   <input type="text" name="bankIfsc" required value={form.bankIfsc}
//                     onChange={(e) => setForm(p => ({ ...p, bankIfsc: e.target.value.toUpperCase() }))}
//                     placeholder="e.g. SBIN0001234" className={inp} />
//                   <p className="text-xs text-gray-400 mt-1">11-character code on your cheque / passbook</p>
//                 </div>
//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Bank Name <span className="text-red-500">*</span></label>
//                   <input type="text" name="bankName" required value={form.bankName} onChange={handleChange}
//                     placeholder="e.g. State Bank of India" className={inp} />
//                 </div>
//               </div>

//               <button onClick={() => { if (validateStep0()) setStep(1) }}
//                 className="w-full bg-[#1a5c2a] text-white py-4 rounded-full font-bold text-sm hover:bg-[#2d7a3a] transition-all shadow-lg">
//                 Next: Upload Documents →
//               </button>
//             </>
//           )}

//           {/* ── STEP 1: Documents ── */}
//           {step === 1 && (
//             <>
//               <h3 className="text-[#1a5c2a] font-bold text-base mb-1 border-b-2 border-[#f0c020] pb-2">📄 Upload Documents</h3>
//               <p className="text-gray-400 text-xs mb-5">Photo and Signature will appear on your application form.</p>

//               <div className="mb-4">
//                 <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-wider mb-3">Required Documents</p>
//                 <div className="grid sm:grid-cols-2 gap-5">
//                   <FileUpload label="Applicant Photo"  name="photo"      accept="image/jpeg,image/png,image/jpg"                    required onChange={handleFileChange} hint="JPG or PNG • Passport-size, clear face" />
//                   <FileUpload label="Signature"        name="signature"  accept="image/jpeg,image/png,image/jpg"                    required onChange={handleFileChange} hint="JPG or PNG • Sign on white paper" />
//                   <FileUpload label="Aadhar Card"      name="aadharDoc"  accept="image/jpeg,image/png,image/jpg,application/pdf"    required onChange={handleFileChange} hint="JPG, PNG or PDF • Both sides visible" />
//                   <FileUpload label="Bank Passbook"    name="bankPassbook" accept="image/jpeg,image/png,image/jpg,application/pdf"  required onChange={handleFileChange} hint="JPG, PNG or PDF • First page with account details" />
//                 </div>
//               </div>

//               {(show10thDoc || show12thDoc) && (
//                 <div className="mb-4">
//                   <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-wider mb-1">Education Documents</p>
//                   <p className="text-gray-400 text-xs mb-3">Upload marksheets for classes you filled in previous step.</p>
//                   <div className="grid sm:grid-cols-2 gap-5">
//                     {show10thDoc && <FileUpload label="10th Class Marksheet" name="tenthDoc"   accept="image/jpeg,image/png,image/jpg,application/pdf" required onChange={handleFileChange} hint="JPG, PNG or PDF" />}
//                     {show12thDoc && <FileUpload label="12th Class Marksheet" name="twelfthDoc" accept="image/jpeg,image/png,image/jpg,application/pdf" required onChange={handleFileChange} hint="JPG, PNG or PDF" />}
//                   </div>
//                 </div>
//               )}

//               <div className="mb-6">
//                 <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-wider mb-3">Optional Documents</p>
//                 <div className="grid sm:grid-cols-2 gap-5">
//                   <FileUpload label="Additional Document" name="additionalDoc" accept="image/jpeg,image/png,image/jpg,application/pdf" required={false} onChange={handleFileChange} hint="Any other supporting document" />
//                 </div>
//               </div>

//               <div className="bg-[#f0f7f0] rounded-2xl p-4 mb-6 border-l-4 border-[#f0c020]">
//                 <label className="flex items-start gap-3 cursor-pointer">
//                   <input type="checkbox" checked={declarationChecked} onChange={(e) => setDeclarationChecked(e.target.checked)}
//                     className="mt-1 accent-[#1a5c2a] w-4 h-4 flex-shrink-0" />
//                   <span className="text-gray-600 text-xs leading-relaxed">
//                     I hereby declare that all information provided above is true and correct.
//                     I understand that any false information may result in cancellation of my application.
//                     I agree to the terms and conditions of this recruitment.
//                   </span>
//                 </label>
//               </div>

//               <button onClick={() => { if (validateStep1()) setStep(2) }}
//                 className="w-full bg-[#1a5c2a] text-white py-4 rounded-full font-bold text-sm hover:bg-[#2d7a3a] transition-all shadow-lg">
//                 Next: Payment →
//               </button>
//             </>
//           )}

//           {/* ── STEP 2: Payment ── */}
//           {step === 2 && (
//             <>
//               <h3 className="text-[#1a5c2a] font-bold text-base mb-1 border-b-2 border-[#f0c020] pb-2">💳 Payment</h3>
//               <p className="text-gray-400 text-xs mb-5">Complete your payment and fill the transaction details below.</p>

//               {/* Fee Summary */}
//               <div className="bg-[#fffdf0] border border-[#f0c020] rounded-2xl p-4 mb-5 text-xs text-gray-600">
//                 <p className="font-semibold text-[#1a5c2a] mb-1">Application Fee:</p>
//                 <p>• General: <span className="font-bold">{post.feeGeneral}</span></p>
//                 <p>• OBC / SC / ST / EWS: <span className="font-bold">{post.feeOBC}</span></p>
//                 <p className="mt-1 text-gray-400">Your category: <strong className="text-[#1a5c2a]">{form.category}</strong> →
//                   <strong className="text-[#1a5c2a]"> {form.category === 'General' ? post.feeGeneral : post.feeOBC}</strong>
//                 </p>
//               </div>

//               {/* Payment Method Tabs */}
//               <div className="flex gap-2 mb-5">
//                 {['UPI'].map(method => (
//                   <button key={method} onClick={() => setPaymentMethod(method)}
//                     className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all
//                       ${paymentMethod === method
//                         ? 'bg-[#1a5c2a] border-[#1a5c2a] text-white shadow-md'
//                         : 'bg-white border-gray-200 text-gray-500 hover:border-[#1a5c2a]'}`}>
//                     📲 UPI
//                   </button>
//                 ))}
//               </div>

//               <PaymentInfoCard method={paymentMethod} feeGeneral={post.feeGeneral} feeOBC={post.feeOBC} category={form.category} />

//               {/* Fraud Warning */}
//               <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
//                 <span className="text-red-500 text-base mt-0.5">⚠️</span>
//                 <p className="text-red-700 text-xs leading-relaxed">
//                   <strong>Warning:</strong> Fake or duplicate Transaction ID will lead to immediate cancellation without refund.
//                 </p>
//               </div>

//               {/* Dynamic Fields */}
//               <div className="grid sm:grid-cols-2 gap-4 mb-5">
//                 <div className="sm:col-span-2">
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Sender Name <span className="text-red-500">*</span></label>
//                   <input type="text" name="senderName" value={payment.senderName} onChange={handlePaymentChange}
//                     placeholder="Name shown in your UPI app" className={inp} />
//                 </div>
//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Sender UPI ID <span className="text-red-500">*</span></label>
//                   <input type="text" name="senderUpiId" value={payment.senderUpiId} onChange={handlePaymentChange}
//                     placeholder="e.g. yourname@upi" className={inp} />
//                 </div>
//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Transaction ID <span className="text-red-500">*</span></label>
//                   <input type="text" name="transactionId" value={payment.transactionId} onChange={handlePaymentChange}
//                     placeholder="e.g. T2345678901" className={inp} />
//                   <p className="text-xs text-gray-400 mt-1">Copy from your UPI app → Transaction history</p>
//                 </div>

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Payment Date <span className="text-red-500">*</span></label>
//                   <input type="date" name="paymentDate" value={payment.paymentDate} onChange={handlePaymentChange}
//                     max={new Date().toISOString().split('T')[0]} className={inp} />
//                   <p className="text-xs text-gray-400 mt-1">Date shown in your UPI app</p>
//                 </div>

//                 <div>
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Payment Time <span className="text-red-500">*</span></label>
//                   <input type="time" name="paymentTime" value={payment.paymentTime} onChange={handlePaymentChange} className={inp} />
//                   <p className="text-xs text-gray-400 mt-1">Time shown in your UPI app</p>
//                 </div>

//                 {/* Screenshot Upload */}
//                 <div className="sm:col-span-2">
//                   <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Payment Screenshot <span className="text-red-500">*</span></label>
//                   <p className="text-gray-400 text-xs mb-2">Upload screenshot showing transaction ID and amount</p>
//                   <div onClick={() => document.getElementById('screenshotInput').click()}
//                     className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-pointer hover:border-[#1a5c2a] hover:bg-[#f0f7f0] transition-all flex items-center gap-3">
//                     <span className="text-xl">📎</span>
//                     <span className="flex-1 truncate">{payment.screenshotFile?.name || 'Click to upload screenshot'}</span>
//                     <span className="text-xs text-[#4a9e5c] font-semibold shrink-0">Browse</span>
//                   </div>
//                   <input id="screenshotInput" type="file" accept="image/jpeg,image/png,image/jpg" className="hidden"
//                     onChange={(e) => {
//                       const file = e.target.files[0]
//                       if (!file) return
//                       const reader = new FileReader()
//                       reader.onload = (ev) => setPayment(p => ({ ...p, screenshotFile: file, screenshotPreview: ev.target.result }))
//                       reader.readAsDataURL(file)
//                     }} />
//                   {payment.screenshotPreview && (
//                     <div className="mt-2 relative inline-block">
//                       <img src={payment.screenshotPreview} alt="screenshot" className="h-24 w-24 object-cover rounded-lg border-2 border-[#4a9e5c]" />
//                       <span className="absolute -top-1.5 -right-1.5 bg-[#1a5c2a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* What happens next */}
//               <div className="bg-[#f0f7f0] rounded-2xl p-4 mb-6 border-l-4 border-[#1a5c2a]">
//                 <p className="text-[#1a5c2a] font-bold text-xs mb-2">📋 After Submission:</p>
//                 <ul className="text-xs text-gray-600 space-y-1">
//                   <li>✓ Your application PDF will be generated automatically</li>
//                   <li>✓ Your payment will be verified within 24 hours</li>
//                   <li>✓ Status will be updated to Verified / Rejected</li>
//                   <li>✓ You can check status using your Registration Number</li>
//                 </ul>
//               </div>

//               <button onClick={handleFinalSubmit} disabled={loading}
//                 className="w-full bg-[#1a5c2a] text-white py-4 rounded-full font-bold text-sm hover:bg-[#2d7a3a] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
//                 {loading
//                   ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> {loadingMsg}</>
//                   : '✅ Submit Application →'
//                 }
//               </button>
//             </>
//           )}

//         </div>
//       </section>
//     </main>
//   )
// }
























// src/pages/ApplyFormPage.jsx
// ✅ OPTIMIZED:
//   • Loading messages user-friendly hain
//   • File compress + validation fast hai
//   • Success page pe PDF turant available hai

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const PAYMENT_CONFIG = {
  upiId:         'pranshushrivastav907-1@okaxis',
  qrCodeUrl:     '/qr-code.jpeg',
  bankName:      'Punjab National Bank',
  accountName:   'Pranshu Shrivastav',
  accountNumber: '1887010007899',
  ifscCode:      'PUNB0188720',
  branch:        'Ranganj Bazar, Pratapgarh, UP - 230402',
}

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

// ─── Loading Steps (user ko dikhane ke liye) ─────────────────────────────────
const LOADING_STEPS = [
  { id: 'validate',  label: 'Transaction ID verify ho raha hai...',   icon: '🔍' },
  { id: 'compress',  label: 'Documents compress ho rahe hain...',     icon: '📦' },
  { id: 'submit',    label: 'Application submit ho rahi hai...',      icon: '📤' },
  { id: 'pdf',       label: 'Application PDF ban rahi hai...',        icon: '📄' },
  { id: 'done',      label: 'Almost done...',                         icon: '✅' },
]

// ─── Image Compressor ─────────────────────────────────────────────────────────
function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = (e) => resolve({
        base64:       e.target.result.split(',')[1],
        mimetype:     file.type,
        originalName: file.name,
      })
      reader.readAsDataURL(file)
      return
    }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale  = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width  = img.width  * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve({
        base64:       dataUrl.split(',')[1],
        mimetype:     'image/jpeg',
        originalName: file.name,
      })
    }
    img.onerror = () => {
      const reader = new FileReader()
      reader.onload = (e) => resolve({
        base64:       e.target.result.split(',')[1],
        mimetype:     file.type,
        originalName: file.name,
      })
      reader.readAsDataURL(file)
    }
    img.src = url
  })
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = 'error', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 6000); return () => clearTimeout(t) }, [onClose])
  const bg = type === 'error'
    ? 'bg-red-50 border-red-200 text-red-800'
    : type === 'success'
      ? 'bg-green-50 border-green-200 text-green-800'
      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-sm w-[90vw] ${bg}`}>
      <span className="text-base mt-0.5">{type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
      <p className="text-sm leading-snug flex-1">{message}</p>
      <button onClick={onClose} className="text-base opacity-60 hover:opacity-100 leading-none mt-0.5">✕</button>
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState([])
  const show   = useCallback((message, type = 'error') => setToasts(p => [...p, { id: Date.now(), message, type }]), [])
  const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), [])
  const ToastContainer = (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center gap-2 pt-4 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast message={t.message} type={t.type} onClose={() => remove(t.id)} />
        </div>
      ))}
    </div>
  )
  return { show, ToastContainer }
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────
function LoadingOverlay({ currentStep }) {
  const stepIndex = LOADING_STEPS.findIndex(s => s.id === currentStep)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xs w-[90vw] text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-[#f0f7f0]" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#1a5c2a] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {LOADING_STEPS[Math.max(0, stepIndex)]?.icon || '⏳'}
          </div>
        </div>

        {/* Current step message */}
        <p className="text-[#1a5c2a] font-bold text-sm mb-4">
          {LOADING_STEPS[Math.max(0, stepIndex)]?.label || 'Processing...'}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {LOADING_STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`rounded-full transition-all duration-300 ${
                i < stepIndex
                  ? 'w-2.5 h-2.5 bg-[#1a5c2a]'
                  : i === stepIndex
                    ? 'w-4 h-2.5 bg-[#4a9e5c]'
                    : 'w-2.5 h-2.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <p className="text-gray-400 text-xs">
          Kripya page band mat karein
        </p>
      </div>
    </div>
  )
}

// ─── File Upload Field ────────────────────────────────────────────────────────
function FileUpload({ label, name, accept, required, onChange, hint }) {
  const [fileName, setFileName] = useState('')
  const [preview,  setPreview]  = useState(null)
  const inputRef = useRef()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    if (file.type.startsWith('image/')) {
      const r = new FileReader()
      r.onload = (ev) => setPreview(ev.target.result)
      r.readAsDataURL(file)
    } else {
      setPreview(null)
    }
    onChange(name, file)
  }

  return (
    <div>
      <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">
        {label}{' '}
        {required
          ? <span className="text-red-500">*</span>
          : <span className="text-gray-400 font-normal ml-1">(Optional)</span>}
      </label>
      {hint && <p className="text-gray-400 text-xs mb-2">{hint}</p>}
      <div
        onClick={() => inputRef.current.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-pointer hover:border-[#1a5c2a] hover:bg-[#f0f7f0] transition-all flex items-center gap-3"
      >
        <span className="text-xl">📎</span>
        <span className="flex-1 truncate">{fileName || 'Click to upload file'}</span>
        <span className="text-xs text-[#4a9e5c] font-semibold shrink-0">Browse</span>
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      {preview && (
        <div className="mt-2 relative inline-block">
          <img src={preview} alt="preview" className="h-20 w-20 object-cover rounded-lg border-2 border-[#4a9e5c]" />
          <span className="absolute -top-1.5 -right-1.5 bg-[#1a5c2a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</span>
        </div>
      )}
      {fileName && !preview && (
        <p className="text-xs text-[#4a9e5c] mt-1.5 flex items-center gap-1"><span>✓</span> {fileName}</p>
      )}
    </div>
  )
}

// ─── Step Bar ─────────────────────────────────────────────────────────────────
function StepBar({ current }) {
  const steps = ['Personal Details', 'Documents', 'Payment']
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
              ${i < current  ? 'bg-[#1a5c2a] border-[#1a5c2a] text-white' :
                i === current ? 'bg-[#f0c020] border-[#f0c020] text-[#1a5c2a]' :
                                'bg-white border-gray-300 text-gray-400'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 font-semibold hidden sm:block ${i === current ? 'text-[#1a5c2a]' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-4 sm:mb-5 transition-all ${i < current ? 'bg-[#1a5c2a]' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function isEduRowFilled(row) {
  return !!(row.rollEnroll || row.college || row.board || row.year || row.totalMarks || row.obtainMarks)
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch (_) {}
  }
  return (
    <button onClick={copy} className="ml-2 text-xs bg-[#1a5c2a] text-white px-2 py-0.5 rounded-full hover:bg-[#2d7a3a] transition-all">
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ─── Payment Info Card ────────────────────────────────────────────────────────
function PaymentInfoCard({ method, feeGeneral, feeOBC, category }) {
  const amount = category === 'General' ? feeGeneral : feeOBC

  if (method === 'UPI') {
    return (
      <div className="bg-[#f0f7f0] border border-[#4a9e5c] rounded-2xl p-4 mb-5">
        <p className="text-[#1a5c2a] font-bold text-sm mb-3">📲 Pay via UPI</p>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="w-52 h-52 bg-white border-2 border-[#1a5c2a] rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={PAYMENT_CONFIG.qrCodeUrl}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="hidden w-full h-full flex-col items-center justify-center text-gray-400 text-xs text-center p-2">
                <span className="text-3xl mb-1">📷</span>
                <span>Add qr-code.jpeg to /public</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">Scan QR to pay</span>
          </div>
          <div className="flex-1 space-y-2 w-full">
            <div className="bg-white rounded-xl px-4 py-2.5 border border-gray-200">
              <p className="text-xs text-gray-400 mb-0.5">Receiver Name</p>
              <span className="font-bold text-[#1a5c2a] text-sm">{PAYMENT_CONFIG.accountName}</span>
            </div>
            <div className="bg-white rounded-xl px-4 py-2.5 border border-gray-200">
              <p className="text-xs text-gray-400 mb-0.5">UPI ID</p>
              <div className="flex items-center">
                <span className="font-bold text-[#1a5c2a] text-sm">{PAYMENT_CONFIG.upiId}</span>
                <CopyButton text={PAYMENT_CONFIG.upiId} />
              </div>
            </div>
            <div className="bg-[#fffdf0] border border-[#f0c020] rounded-xl px-4 py-2.5">
              <p className="text-xs text-gray-400 mb-0.5">Amount to Pay</p>
              <p className="font-bold text-[#1a5c2a] text-base">{amount}</p>
            </div>
            <p className="text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
              💡 After payment, copy the <strong>Transaction ID / UTR</strong> from your UPI app and paste below.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f0f7f0] border border-[#4a9e5c] rounded-2xl p-4 mb-5">
      <p className="text-[#1a5c2a] font-bold text-sm mb-3">🏦 Bank Transfer Details</p>
      <div className="grid sm:grid-cols-2 gap-2 mb-3">
        {[
          { label: 'Account Name',   value: PAYMENT_CONFIG.accountName   },
          { label: 'Account Number', value: PAYMENT_CONFIG.accountNumber },
          { label: 'IFSC Code',      value: PAYMENT_CONFIG.ifscCode      },
          { label: 'Bank Name',      value: PAYMENT_CONFIG.bankName      },
          { label: 'Branch',         value: PAYMENT_CONFIG.branch        },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl px-4 py-2.5 border border-gray-200">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <div className="flex items-center">
              <span className="font-bold text-[#1a5c2a] text-sm">{value}</span>
              <CopyButton text={value} />
            </div>
          </div>
        ))}
        <div className="bg-[#fffdf0] border border-[#f0c020] rounded-xl px-4 py-2.5">
          <p className="text-xs text-gray-400 mb-0.5">Amount to Transfer</p>
          <p className="font-bold text-[#1a5c2a] text-base">{amount}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
        💡 After transfer, enter the <strong>UTR / Reference Number</strong> from your bank app below.
      </p>
    </div>
  )
}

// ─── UTR Duplicate check ──────────────────────────────────────────────────────
async function checkDuplicateUTR(utr) {
  if (!APPS_SCRIPT_URL) return false
  try {
    const res  = await fetch(`${APPS_SCRIPT_URL}?action=checkUTR&utr=${encodeURIComponent(utr)}`)
    const data = await res.json()
    return data.isDuplicate === true
  } catch {
    return false
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function ApplyFormPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const post     = location.state?.post
  const { show: showToast, ToastContainer } = useToast()

  const [step,               setStep]               = useState(0)
  const [loading,            setLoading]            = useState(false)
  const [currentLoadingStep, setCurrentLoadingStep] = useState('validate')
  const [declarationChecked, setDeclarationChecked] = useState(false)
  const [paymentMethod,      setPaymentMethod]      = useState('UPI')

  const [payment, setPayment] = useState({
    senderName:        '',
    senderUpiId:       '',
    transactionId:     '',
    paymentDate:       '',
    paymentTime:       '',
    accountHolderName: '',
    lastFourDigits:    '',
    referenceNumber:   '',
    screenshotFile:    null,
    screenshotPreview: null,
  })

  const [form, setForm] = useState({
    name:          '',
    fatherName:    '',
    motherName:    '',
    dob:           '',
    mobile:        '',
    email:         '',
    gender:        '',
    category:      '',
    nationality:   'Indian',
    state:         '',
    district:      '',
    block:         '',
    pincode:       '',
    address:       '',
    qualification: '',
    aadhar:        '',
    bankAccountNo: '',
    bankIfsc:      '',
    bankName:      '',
  })

  const [files, setFiles] = useState({
    photo:            null,
    signature:        null,
    aadharDoc:        null,
    bankPassbook:     null,
    tenthDoc:         null,
    twelfthDoc:       null,
    qualificationDoc: null,
    additionalDoc:    null,
  })

  const [education, setEducation] = useState([
    { class: '10th Class', rollEnroll: '', college: '', board: '', year: '', totalMarks: '', obtainMarks: '', percentage: '' },
    { class: '12th Class', rollEnroll: '', college: '', board: '', year: '', totalMarks: '', obtainMarks: '', percentage: '' },
  ])

  const show10thDoc = isEduRowFilled(education[0])
  const show12thDoc = isEduRowFilled(education[1])

  useEffect(() => { if (!post) navigate('/posts', { replace: true }) }, [post, navigate])

  const handleChange        = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleFileChange    = (name, file) => setFiles(p => ({ ...p, [name]: file }))
  const handlePaymentChange = (e) => setPayment(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleEduChange = (i, field, value) => {
    setEducation(prev => {
      const updated = prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r)
      if (field === 'obtainMarks' || field === 'totalMarks') {
        const row    = updated[i]
        const total  = parseFloat(field === 'totalMarks'  ? value : row.totalMarks)
        const obtain = parseFloat(field === 'obtainMarks' ? value : row.obtainMarks)
        updated[i]   = {
          ...updated[i],
          percentage: (total > 0 && obtain >= 0 && obtain <= total)
            ? ((obtain / total) * 100).toFixed(2) : '',
        }
      }
      return updated
    })
  }

  // ─── Validations ────────────────────────────────────────────────────────────
  const validateStep0 = () => {
    const required = [
      ['name',          "Applicant's Full Name"],
      ['fatherName',    "Father's / Husband's Name"],
      ['dob',           'Date of Birth'],
      ['mobile',        'Mobile Number'],
      ['email',         'Email Address'],
      ['gender',        'Gender'],
      ['category',      'Category'],
      ['nationality',   'Nationality'],
      ['state',         'State'],
      ['district',      'District'],
      ['block',         'Block'],
      ['pincode',       'Pincode'],
      ['address',       'Full Address'],
      ['qualification', 'Educational Qualification'],
      ['aadhar',        'Aadhar Card Number'],
      ['bankAccountNo', 'Bank Account Number'],
      ['bankIfsc',      'Bank IFSC Code'],
      ['bankName',      'Bank Name'],
    ]
    for (const [key, label] of required) {
      if (!form[key]?.trim()) { showToast(`Please fill in: ${label}`); return false }
    }
    if (!/^\d{12}$/.test(form.aadhar))                                  { showToast('Aadhar number must be exactly 12 digits'); return false }
    if (!/^\d{10}$/.test(form.mobile))                                  { showToast('Mobile number must be exactly 10 digits'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))                 { showToast('Please enter a valid email address'); return false }
    if (!/^\d{6}$/.test(form.pincode))                                  { showToast('Pincode must be exactly 6 digits'); return false }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.bankIfsc.toUpperCase()))   { showToast('Enter a valid IFSC Code (e.g. SBIN0001234)'); return false }
    return true
  }

  const validateStep1 = () => {
    if (!files.photo)        { showToast('Please upload your Passport-size Photo'); return false }
    if (!files.signature)    { showToast('Please upload your Signature'); return false }
    if (!files.aadharDoc)    { showToast('Please upload your Aadhar Card document'); return false }
    if (!files.bankPassbook) { showToast('Please upload your Bank Passbook'); return false }
    if (show10thDoc && !files.tenthDoc)   { showToast('Please upload your 10th Class Marksheet'); return false }
    if (show12thDoc && !files.twelfthDoc) { showToast('Please upload your 12th Class Marksheet'); return false }
    if (!declarationChecked) { showToast('Please read and accept the declaration'); return false }
    return true
  }

  const validateStep2 = () => {
    if (paymentMethod === 'UPI') {
      if (!payment.senderName?.trim())    { showToast('Please enter Sender Name'); return false }
      if (!payment.senderUpiId?.trim())   { showToast('Please enter your Sender UPI ID'); return false }
      if (!payment.transactionId?.trim()) { showToast('Transaction ID is required'); return false }
      if (!/^[a-zA-Z0-9_\-]{8,}$/.test(payment.transactionId.trim())) {
        showToast('Enter a valid Transaction ID (min 8 characters)'); return false
      }
      if (!payment.paymentDate?.trim()) { showToast('Please enter Payment Date'); return false }
      if (!payment.paymentTime?.trim()) { showToast('Please enter Payment Time'); return false }
      if (!payment.screenshotFile)      { showToast('Please upload payment screenshot'); return false }
    } else {
      if (!payment.accountHolderName?.trim()) { showToast('Please enter Account Holder Name'); return false }
      if (!payment.lastFourDigits?.trim() || !/^\d{4}$/.test(payment.lastFourDigits)) {
        showToast('Last 4 digits must be exactly 4 digits'); return false
      }
      if (!payment.referenceNumber?.trim()) { showToast('UTR / Reference Number is required'); return false }
      if (!/^[a-zA-Z0-9_\-]{8,}$/.test(payment.referenceNumber.trim())) {
        showToast('Enter a valid UTR / Reference Number (min 8 characters)'); return false
      }
      if (!payment.paymentDate?.trim()) { showToast('Please enter Payment Date'); return false }
      if (!payment.paymentTime?.trim()) { showToast('Please enter Payment Time'); return false }
      if (!payment.screenshotFile)      { showToast('Please upload payment screenshot'); return false }
    }
    return true
  }

  // ─── Final Submit ────────────────────────────────────────────────────────────
  const handleFinalSubmit = async () => {
    if (!validateStep2() || loading) return
    setLoading(true)

    const utr = paymentMethod === 'UPI'
      ? payment.transactionId.trim()
      : payment.referenceNumber.trim()

    try {
      // ── Step 1: UTR duplicate check ─────────────────────────────────────────
      setCurrentLoadingStep('validate')
      const isDuplicate = await checkDuplicateUTR(utr)
      if (isDuplicate) {
        showToast('⚠️ Duplicate Transaction ID detected!', 'error')
        setLoading(false)
        return
      }

      // ── Step 2: Compress files ──────────────────────────────────────────────
      setCurrentLoadingStep('compress')
      const [
        photoObj, signatureObj, aadharDocObj,
        bankPassbookObj, tenthDocObj, twelfthDocObj,
        qualDocObj, addDocObj, screenshotObj,
      ] = await Promise.all([
        files.photo            ? compressImage(files.photo,            800,  0.75) : Promise.resolve(null),
        files.signature        ? compressImage(files.signature,        600,  0.80) : Promise.resolve(null),
        files.aadharDoc        ? compressImage(files.aadharDoc,        1200, 0.80) : Promise.resolve(null),
        files.bankPassbook     ? compressImage(files.bankPassbook,     1200, 0.80) : Promise.resolve(null),
        files.tenthDoc         ? compressImage(files.tenthDoc,         1200, 0.80) : Promise.resolve(null),
        files.twelfthDoc       ? compressImage(files.twelfthDoc,       1200, 0.80) : Promise.resolve(null),
        files.qualificationDoc ? compressImage(files.qualificationDoc, 1200, 0.80) : Promise.resolve(null),
        files.additionalDoc    ? compressImage(files.additionalDoc,    1200, 0.80) : Promise.resolve(null),
        payment.screenshotFile ? compressImage(payment.screenshotFile, 1000, 0.75) : Promise.resolve(null),
      ])

      const uploadedFiles = {
        photo:            photoObj,
        signature:        signatureObj,
        aadharDoc:        aadharDocObj,
        bankPassbook:     bankPassbookObj,
        tenthDoc:         tenthDocObj,
        twelfthDoc:       twelfthDocObj,
        qualificationDoc: qualDocObj,
        additionalDoc:    addDocObj,
        screenshot:       screenshotObj,
      }

      // ── Step 3: Backend call ────────────────────────────────────────────────
      // Apps Script (RegNo) + PDF generation backend pe hoga
      // Drive + Email backend background mein karega
      setCurrentLoadingStep('submit')

      const backendRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/verify-payment`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: {
              ...form,
              postTitle: post.title,
              postLevel: post.level || '',
              education: JSON.stringify(education),
            },
            paymentInfo: {
              paymentMethod,
              utrNumber:         utr,
              senderName:        paymentMethod === 'UPI'           ? payment.senderName        : '',
              senderUpiId:       paymentMethod === 'UPI'           ? payment.senderUpiId       : '',
              accountHolderName: paymentMethod === 'Bank Transfer' ? payment.accountHolderName : '',
              lastFourDigits:    paymentMethod === 'Bank Transfer' ? payment.lastFourDigits    : '',
              paymentDate:       payment.paymentDate,
              paymentTime:       payment.paymentTime,
              paymentStatus:     'Under Review',
            },
            uploadedFiles,
          }),
        }
      )

      // Loading step PDF pe switch karo (backend pe PDF ban rahi hai)
      setCurrentLoadingStep('pdf')

      if (!backendRes.ok) {
        const errData = await backendRes.json().catch(() => ({}))
        showToast(errData.error || 'Submission failed. Please try again.', 'error')
        setLoading(false)
        return
      }

      setCurrentLoadingStep('done')
      const result         = await backendRes.json()
      const registrationNo = result.registrationNo

      if (!registrationNo) {
        showToast('Registration number generate nahi hua. Please try again.', 'error')
        setLoading(false)
        return
      }

      const filename = `Application_${form.name.replace(/\s+/g, '_')}_${registrationNo}.pdf`

      // ── Navigate to success ─────────────────────────────────────────────────
      navigate('/success', {
        state: {
          name:          form.name,
          post:          post.title,
          pdfBase64:     result.pdfBase64 || null,
          filename,
          driveLink:     result.driveLink || null,
          registrationNo,
          paymentMethod,
          utr,
          paymentDate:   payment.paymentDate,
          paymentTime:   payment.paymentTime,
          paymentStatus: 'Under Review',
        },
      })

    } catch (err) {
      showToast(err.message || 'Submission failed. Please try again.', 'error')
      setLoading(false)
    }
  }

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
  ]

  if (!post) return null

  const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a5c2a] transition-colors"
  const sel = `${inp} bg-white`

  return (
    <main className="overflow-x-hidden">
      {ToastContainer}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay currentStep={currentLoadingStep} />}

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1a5c2a] to-[#4a9e5c] py-12 md:py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-[#f0c020] uppercase text-xs font-bold tracking-widest">{post.level} — Registration Form</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">{post.title}</h1>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-[#f0c020]" />
          <p className="text-green-100 text-sm mt-4">Age Limit: {post.ageLimit} &nbsp;|&nbsp; Fee: {post.feeGeneral} (Gen) / {post.feeOBC} (OBC/SC/ST)</p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          className="mb-6 text-[#1a5c2a] font-semibold text-sm flex items-center gap-2 hover:underline"
        >
          ← {step > 0 ? 'Previous Step' : 'Back to Posts'}
        </button>

        <StepBar current={step} />

        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border-b-4 border-[#f0c020]">

          {/* Post badge */}
          <div className="mb-6 bg-[#f0f7f0] rounded-2xl px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Applying For</p>
              <p className="text-[#1a5c2a] font-bold text-sm">{post.title}</p>
            </div>
            <span className="bg-[#f0c020] text-[#1a5c2a] text-xs font-bold px-3 py-1 rounded-full">{post.level}</span>
          </div>

          {/* ── STEP 0: Personal Details ── */}
          {step === 0 && (
            <>
              <h3 className="text-[#1a5c2a] font-bold text-base mb-4 border-b-2 border-[#f0c020] pb-2">👤 Personal Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Applicant's Full Name",     name: 'name',       type: 'text', placeholder: 'Enter full name as per Aadhar' },
                  { label: "Father's / Husband's Name", name: 'fatherName', type: 'text', placeholder: "Enter father's or husband's name" },
                  { label: "Mother's Name",             name: 'motherName', type: 'text', placeholder: "Enter mother's name" },
                  { label: 'Date of Birth',             name: 'dob',        type: 'date' },
                  { label: 'Aadhar Card Number',        name: 'aadhar',     type: 'text', maxLength: 12, placeholder: '12-digit Aadhar number' },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">{f.label} <span className="text-red-500">*</span></label>
                    <input type={f.type} name={f.name} required maxLength={f.maxLength}
                      placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} className={inp} />
                  </div>
                ))}

                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Gender <span className="text-red-500">*</span></label>
                  <select name="gender" required value={form.gender} onChange={handleChange} className={sel}>
                    <option value="">-- Select --</option>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select name="category" required value={form.category} onChange={handleChange} className={sel}>
                    <option value="">-- Select --</option>
                    <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Nationality <span className="text-red-500">*</span></label>
                  <select name="nationality" required value={form.nationality} onChange={handleChange} className={sel}>
                    <option value="Indian">Indian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Educational Qualification <span className="text-red-500">*</span></label>
                  <select name="qualification" required value={form.qualification} onChange={handleChange} className={sel}>
                    <option value="">-- Select --</option>
                    <option>10th Pass</option><option>12th Pass</option><option>Other</option>
                  </select>
                </div>
              </div>

              {/* Education Table */}
              <h3 className="text-[#1a5c2a] font-bold text-base mb-3 border-b-2 border-[#f0c020] pb-2">🎓 Education Details</h3>
              <p className="text-gray-400 text-xs mb-3">Fill only the rows that apply to you.</p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1a5c2a] text-white">
                      {['Class','Roll/Enroll No.','College / School','Board / University','Year','Total Marks','Obtain Marks','%'].map(h => (
                        <th key={h} className="px-2 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {education.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#f0f7f0]' : 'bg-white'}>
                        <td className="px-2 py-1.5 font-semibold text-[#1a5c2a] whitespace-nowrap">{row.class}</td>
                        {['rollEnroll','college','board','year','totalMarks','obtainMarks'].map(field => (
                          <td key={field} className="px-1 py-1">
                            <input type="text" value={row[field]}
                              onChange={(e) => handleEduChange(i, field, e.target.value)}
                              className="w-full border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-[#1a5c2a]"
                              placeholder="—" />
                          </td>
                        ))}
                        <td className="px-2 py-1.5 text-center font-bold text-[#1a5c2a]">{row.percentage || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Contact Details */}
              <h3 className="text-[#1a5c2a] font-bold text-base mb-4 border-b-2 border-[#f0c020] pb-2">📞 Contact Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Mobile Number (10 digits)', name: 'mobile', type: 'tel',   maxLength: 10, placeholder: '10-digit mobile number' },
                  { label: 'Email Address',             name: 'email',  type: 'email',               placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">{f.label} <span className="text-red-500">*</span></label>
                    <input type={f.type} name={f.name} required maxLength={f.maxLength}
                      placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} className={inp} />
                  </div>
                ))}

                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">State <span className="text-red-500">*</span></label>
                  <select name="state" required value={form.state} onChange={handleChange} className={sel}>
                    <option value="">-- Select State --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">District <span className="text-red-500">*</span></label>
                  <input type="text" name="district" required value={form.district} onChange={handleChange}
                    placeholder="Enter your district" className={inp} />
                </div>

                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Block <span className="text-red-500">*</span></label>
                  <input type="text" name="block" required value={form.block} onChange={handleChange}
                    placeholder="Enter your block" className={inp} />
                </div>

                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Pincode <span className="text-red-500">*</span></label>
                  <input type="text" name="pincode" required maxLength={6} value={form.pincode} onChange={handleChange}
                    placeholder="6-digit pincode" className={inp} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Full Address <span className="text-red-500">*</span></label>
                  <textarea name="address" required rows={3} value={form.address} onChange={handleChange}
                    placeholder="Enter Your Full Address"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a5c2a] transition-colors resize-none" />
                </div>
              </div>

              {/* Bank Details */}
              <h3 className="text-[#1a5c2a] font-bold text-base mb-4 border-b-2 border-[#f0c020] pb-2">🏦 Bank Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="sm:col-span-2">
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Bank Account Number <span className="text-red-500">*</span></label>
                  <input type="text" name="bankAccountNo" required value={form.bankAccountNo} onChange={handleChange}
                    placeholder="Enter your bank account number" className={inp} />
                </div>
                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">IFSC Code <span className="text-red-500">*</span></label>
                  <input type="text" name="bankIfsc" required value={form.bankIfsc}
                    onChange={(e) => setForm(p => ({ ...p, bankIfsc: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SBIN0001234" className={inp} />
                  <p className="text-xs text-gray-400 mt-1">11-character code on your cheque / passbook</p>
                </div>
                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Bank Name <span className="text-red-500">*</span></label>
                  <input type="text" name="bankName" required value={form.bankName} onChange={handleChange}
                    placeholder="e.g. State Bank of India" className={inp} />
                </div>
              </div>

              <button
                onClick={() => { if (validateStep0()) setStep(1) }}
                className="w-full bg-[#1a5c2a] text-white py-4 rounded-full font-bold text-sm hover:bg-[#2d7a3a] transition-all shadow-lg"
              >
                Next: Upload Documents →
              </button>
            </>
          )}

          {/* ── STEP 1: Documents ── */}
          {step === 1 && (
            <>
              <h3 className="text-[#1a5c2a] font-bold text-base mb-1 border-b-2 border-[#f0c020] pb-2">📄 Upload Documents</h3>
              <p className="text-gray-400 text-xs mb-5">Photo and Signature will appear on your application form.</p>

              <div className="mb-4">
                <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-wider mb-3">Required Documents</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FileUpload label="Applicant Photo"  name="photo"        accept="image/jpeg,image/png,image/jpg"                 required onChange={handleFileChange} hint="JPG or PNG • Passport-size, clear face" />
                  <FileUpload label="Signature"        name="signature"    accept="image/jpeg,image/png,image/jpg"                 required onChange={handleFileChange} hint="JPG or PNG • Sign on white paper" />
                  <FileUpload label="Aadhar Card"      name="aadharDoc"    accept="image/jpeg,image/png,image/jpg,application/pdf" required onChange={handleFileChange} hint="JPG, PNG or PDF • Both sides visible" />
                  <FileUpload label="Bank Passbook"    name="bankPassbook" accept="image/jpeg,image/png,image/jpg,application/pdf" required onChange={handleFileChange} hint="JPG, PNG or PDF • First page with account details" />
                </div>
              </div>

              {(show10thDoc || show12thDoc) && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-wider mb-1">Education Documents</p>
                  <p className="text-gray-400 text-xs mb-3">Upload marksheets for classes you filled in previous step.</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {show10thDoc && <FileUpload label="10th Class Marksheet" name="tenthDoc"   accept="image/jpeg,image/png,image/jpg,application/pdf" required onChange={handleFileChange} hint="JPG, PNG or PDF" />}
                    {show12thDoc && <FileUpload label="12th Class Marksheet" name="twelfthDoc" accept="image/jpeg,image/png,image/jpg,application/pdf" required onChange={handleFileChange} hint="JPG, PNG or PDF" />}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-wider mb-3">Optional Documents</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FileUpload label="Additional Document" name="additionalDoc" accept="image/jpeg,image/png,image/jpg,application/pdf" required={false} onChange={handleFileChange} hint="Any other supporting document" />
                </div>
              </div>

              <div className="bg-[#f0f7f0] rounded-2xl p-4 mb-6 border-l-4 border-[#f0c020]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={declarationChecked} onChange={(e) => setDeclarationChecked(e.target.checked)}
                    className="mt-1 accent-[#1a5c2a] w-4 h-4 flex-shrink-0" />
                  <span className="text-gray-600 text-xs leading-relaxed">
                    I hereby declare that all information provided above is true and correct.
                    I understand that any false information may result in cancellation of my application.
                    I agree to the terms and conditions of this recruitment.
                  </span>
                </label>
              </div>

              <button
                onClick={() => { if (validateStep1()) setStep(2) }}
                className="w-full bg-[#1a5c2a] text-white py-4 rounded-full font-bold text-sm hover:bg-[#2d7a3a] transition-all shadow-lg"
              >
                Next: Payment →
              </button>
            </>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <>
              <h3 className="text-[#1a5c2a] font-bold text-base mb-1 border-b-2 border-[#f0c020] pb-2">💳 Payment</h3>
              <p className="text-gray-400 text-xs mb-5">Complete your payment and fill the transaction details below.</p>

              {/* Fee Summary */}
              <div className="bg-[#fffdf0] border border-[#f0c020] rounded-2xl p-4 mb-5 text-xs text-gray-600">
                <p className="font-semibold text-[#1a5c2a] mb-1">Application Fee:</p>
                <p>• General: <span className="font-bold">{post.feeGeneral}</span></p>
                <p>• OBC / SC / ST / EWS: <span className="font-bold">{post.feeOBC}</span></p>
                <p className="mt-1 text-gray-400">Your category: <strong className="text-[#1a5c2a]">{form.category}</strong> →
                  <strong className="text-[#1a5c2a]"> {form.category === 'General' ? post.feeGeneral : post.feeOBC}</strong>
                </p>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-5">
                {['UPI'].map(method => (
                  <button key={method} onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all
                      ${paymentMethod === method
                        ? 'bg-[#1a5c2a] border-[#1a5c2a] text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#1a5c2a]'}`}>
                    📲 UPI
                  </button>
                ))}
              </div>

              <PaymentInfoCard method={paymentMethod} feeGeneral={post.feeGeneral} feeOBC={post.feeOBC} category={form.category} />

              {/* Fraud Warning */}
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
                <span className="text-red-500 text-base mt-0.5">⚠️</span>
                <p className="text-red-700 text-xs leading-relaxed">
                  <strong>Warning:</strong> Fake or duplicate Transaction ID will lead to immediate cancellation without refund.
                </p>
              </div>

              {/* Dynamic Fields */}
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="sm:col-span-2">
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Sender Name <span className="text-red-500">*</span></label>
                  <input type="text" name="senderName" value={payment.senderName} onChange={handlePaymentChange}
                    placeholder="Name shown in your UPI app" className={inp} />
                </div>
                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Sender UPI ID <span className="text-red-500">*</span></label>
                  <input type="text" name="senderUpiId" value={payment.senderUpiId} onChange={handlePaymentChange}
                    placeholder="e.g. yourname@upi" className={inp} />
                </div>
                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Transaction ID <span className="text-red-500">*</span></label>
                  <input type="text" name="transactionId" value={payment.transactionId} onChange={handlePaymentChange}
                    placeholder="e.g. T2345678901" className={inp} />
                  <p className="text-xs text-gray-400 mt-1">Copy from your UPI app → Transaction history</p>
                </div>
                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Payment Date <span className="text-red-500">*</span></label>
                  <input type="date" name="paymentDate" value={payment.paymentDate} onChange={handlePaymentChange}
                    max={new Date().toISOString().split('T')[0]} className={inp} />
                  <p className="text-xs text-gray-400 mt-1">Date shown in your UPI app</p>
                </div>
                <div>
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Payment Time <span className="text-red-500">*</span></label>
                  <input type="time" name="paymentTime" value={payment.paymentTime} onChange={handlePaymentChange} className={inp} />
                  <p className="text-xs text-gray-400 mt-1">Time shown in your UPI app</p>
                </div>

                {/* Screenshot Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-[#1a5c2a] font-semibold text-xs mb-1.5">Payment Screenshot <span className="text-red-500">*</span></label>
                  <p className="text-gray-400 text-xs mb-2">Upload screenshot showing transaction ID and amount</p>
                  <div onClick={() => document.getElementById('screenshotInput').click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-pointer hover:border-[#1a5c2a] hover:bg-[#f0f7f0] transition-all flex items-center gap-3">
                    <span className="text-xl">📎</span>
                    <span className="flex-1 truncate">{payment.screenshotFile?.name || 'Click to upload screenshot'}</span>
                    <span className="text-xs text-[#4a9e5c] font-semibold shrink-0">Browse</span>
                  </div>
                  <input id="screenshotInput" type="file" accept="image/jpeg,image/png,image/jpg" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (ev) => setPayment(p => ({ ...p, screenshotFile: file, screenshotPreview: ev.target.result }))
                      reader.readAsDataURL(file)
                    }} />
                  {payment.screenshotPreview && (
                    <div className="mt-2 relative inline-block">
                      <img src={payment.screenshotPreview} alt="screenshot" className="h-24 w-24 object-cover rounded-lg border-2 border-[#4a9e5c]" />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#1a5c2a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-[#f0f7f0] rounded-2xl p-4 mb-6 border-l-4 border-[#1a5c2a]">
                <p className="text-[#1a5c2a] font-bold text-xs mb-2">📋 After Submission:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ Application PDF turant download ke liye ready hogi</li>
                  <li>✓ Payment 24 ghante mein verify hogi</li>
                  <li>✓ Status Verified / Rejected update hogi</li>
                  <li>✓ Registration Number se status check kar sakte ho</li>
                </ul>
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full bg-[#1a5c2a] text-white py-4 rounded-full font-bold text-sm hover:bg-[#2d7a3a] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                ✅ Submit Application →
              </button>
            </>
          )}

        </div>
      </section>
    </main>
  )
}