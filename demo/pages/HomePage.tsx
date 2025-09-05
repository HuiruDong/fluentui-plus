import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#667eea',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '60px',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px 24px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      textDecoration: 'none',
    },
  },
  categoryTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1f2937',
  },
  categoryDescription: {
    color: '#6b7280',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  componentsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  componentTag: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  statsSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '500',
  },
});

const HomePage: React.FC = () => {
  const styles = useStyles();

  const categories = [
    {
      title: '通用组件',
      description: '通用组件提供基础的 UI 元素，用于构建应用的基本界面。',
      components: ['Tag'],
      path: '/tag',
    },
    {
      title: '导航组件',
      description: '导航组件帮助用户在应用中快速定位和切换页面。',
      components: ['Nav'],
      path: '/nav',
    },
    {
      title: '数据录入组件',
      description: '数据录入组件提供多种输入方式，提升用户体验。',
      components: ['InputTag', 'Select'],
      path: '/inputtag',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>FluentUI Plus</div>
        <div className={styles.subtitle}>
          为 Web 应用提供了丰富的基础 UI 组件， 专为中国企业级应用设计，提供专业的视觉效果和便捷的交互体验。
        </div>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <Link key={index} to={category.path} className={styles.categoryCard}>
            <div className={styles.categoryTitle}>{category.title}</div>
            <div className={styles.categoryDescription}>{category.description}</div>
            <div className={styles.componentsList}>
              {category.components.map((component, idx) => (
                <span key={idx} className={styles.componentTag}>
                  {component}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4</div>
            <div className={styles.statLabel}>组件</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statLabel}>TypeScript</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>12+</div>
            <div className={styles.statLabel}>示例</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
