import React from "react";
import "../styles/Blogs.css";
import FadeInSection from "./FadeInSection";

const Blogs = () => {
  const blogs = [
    {
      title: "Service Discovery in Spring Boot Microservices",
      desc: "How service discovery works in microservice architectures, why Eureka is needed, and how services dynamically find and communicate with each other.",
      link: "https://medium.com/@ashim.roy120388/service-discovery-in-spring-boot-microservices-how-eureka-works-why-we-need-it-and-how-to-156feba7cf06",
    },
    {
      title: "Redis Caching in Spring Boot",
      desc: "From caching theory to a working product cache — exploring Redis, Spring Boot integration, cache configuration, and practical performance improvements.",
      link: "https://medium.com/@ashim.roy120388/redis-caching-in-spring-boot-from-theory-to-a-working-product-cache-4662122aa7c3",
    },
    {
      title: "JPA Projection vs DTO in Spring Boot",
      desc: "Understanding the difference between JPA Projections and DTOs, when to use each, and how they influence database access and API design.",
      link: "https://medium.com/@ashim.roy120388/jpa-projection-vs-dto-in-spring-boot-whats-the-difference-and-when-should-you-use-each-3c8043e8b813",
    },
    {
      title: "Building a Payment Service with Spring Boot & Stripe",
      desc: "Designing a payment service from order creation to payment gateway integration, callbacks, webhooks, and reliable payment processing.",
      link: "https://medium.com/@ashim.roy120388/building-a-payment-service-with-spring-boot-stripe-from-order-creation-to-webhooks-and-69656ff24fe7",
    },
    {
      title: "From Hello World to Machine Code",
      desc: "A journey through the JDK, JRE, JVM, bytecode, and JIT compiler to understand what really happens when Java code runs.",
      link: "https://medium.com/@ashim.roy120388/from-hello-world-to-machine-code-understanding-jdk-jre-jvm-bytecode-jit-the-complete-java-01f33bbfa117",
    },
    {
      title: "Building Pagination, Sorting & Filtering in Spring Boot",
      desc: "Learn how to build production-ready pagination, sorting, and filtering APIs using Spring Boot and Spring Data JPA for efficient handling of large datasets.",
      link: "YOUR_MEDIUM_ARTICLE_URL",
    },
  ];

  return (
    <div id="blogs">
      <div className="section-header">
        <span className="section-title">/ blogs</span>

        <a
          href="https://medium.com/@ashim.roy120388"
          target="_blank"
          rel="noopener noreferrer"
          className="explore-link"
        >
          View all articles
        </a>
      </div>

      <FadeInSection delay="200ms">
        <div className="blogs-description">
          Writing about Java, Spring Boot, distributed systems, backend
          architecture, scalability, and practical software engineering.
        </div>
      </FadeInSection>

      <div className="blogs-grid">
        {blogs.map((blog, i) => (
          <FadeInSection key={i} delay={`${(i + 1) * 100}ms`}>
            <div className="blogs-card">
              <div className="card-title">{blog.title}</div>

              <div className="card-desc">{blog.desc}</div>

              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-badge"
              >
                Read Article
              </a>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default Blogs;