import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  Calculator, 
  Shield, 
  Zap, 
  Smartphone, 
  Globe, 
  Star,
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  TrendingUp,
  Package,
  DollarSign
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  const services = [
    {
      icon: Calculator,
      title: 'Bill Splitter',
      description: 'Split bills effortlessly with our intelligent calculator. Handle tips, taxes, and custom amounts.',
      color: 'from-blue-500 to-cyan-500',
      href: '/bill-splitter',
      stats: 'Smart calculations'
    },
    {
      icon: ShoppingCart,
      title: 'Grocery List',
      description: 'Manage your daily grocery shopping with date-wise tracking, categories, and expense analytics.',
      color: 'from-green-500 to-emerald-500',
      href: '/grocery-list',
      stats: 'Track expenses'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Secure OTP Auth',
      description: 'Email-based OTP authentication for maximum security and convenience.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern technologies for blazing fast performance.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Perfect experience across all devices - desktop, tablet, and mobile.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Star,
      title: 'Futuristic UI',
      description: 'Beautiful, modern interface with smooth animations and effects.',
      color: 'from-rose-500 to-pink-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        // Authenticated User Home Page
        <>
          {/* Welcome Hero Section */}
          <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  Welcome back, <span className="gradient-text">{user?.profile?.name || 'User'}</span>! 👋
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                  Ready to manage your expenses and organize your shopping? 
                  Choose from our powerful services below.
                </p>
              </motion.div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          </section>

          {/* Services Section - Highlighted */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Our <span className="gradient-text">Services</span>
                </h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Powerful tools designed to make your life easier and more organized.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="group"
                    >
                      <Link to={service.href} className="block">
                        <div className="card-glow p-8 text-center hover:scale-105 transition-all duration-300">
                          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${service.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary-400 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-white/70 leading-relaxed mb-4">
                            {service.description}
                          </p>
                          <div className="inline-flex items-center text-primary-400 font-medium group-hover:text-primary-300 transition-colors">
                            {service.stats}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        // Non-Authenticated User Home Page
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="gradient-text">Vertex</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                  The future of multi-service platforms. Experience seamless bill splitting, 
                  secure authentication, and more in one beautiful interface.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/bill-splitter"
                    className="btn-ghost text-lg px-8 py-4 inline-flex items-center justify-center"
                  >
                    Try Bill Splitter
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          </section>
        </>
      )}

      {/* Features Section - Only for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="gradient-text">Vertex</span>?
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience the next generation of web applications with cutting-edge features 
                and beautiful design.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="card-hover group"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section - Only for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card p-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Experience the <span className="gradient-text">Future</span>?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of users who are already using Vertex for their daily needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold gradient-text">Vertex</span>
          </div>
          <p className="text-white/60">
            © 2025 Vertex App. Built with ❤️ for the future.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
