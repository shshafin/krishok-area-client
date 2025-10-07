import { useState, useRef, useCallback, useMemo } from 'react';

const StarRating = ({ onChange, value = 0 }) => {
  const [rating, setRating] = useState(value);
  const [interactiveRating, setInteractiveRating] = useState(value);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef(null);

  const calculateRating = useCallback((clientX) => {
    if (!containerRef.current) return 0.5;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percentage = x / rect.width;
    
    // Calculate rating from 0.5 to 5 with 0.5 increments
    const rawRating = 0.5 + percentage * 4.5;
    const roundedRating = Math.round(rawRating * 2) / 2;
    
    return Math.max(0.5, Math.min(5, roundedRating));
  }, []);

  // Unified interaction handlers
  const handleStartInteraction = useCallback((clientX) => {
    setIsInteracting(true);
    const newRating = calculateRating(clientX);
    setInteractiveRating(newRating);
  }, [calculateRating]);

  const handleMoveInteraction = useCallback((clientX) => {
    if (!isInteracting) return;
    const newRating = calculateRating(clientX);
    setInteractiveRating(newRating);
  }, [isInteracting, calculateRating]);

  const handleEndInteraction = useCallback((clientX) => {
    if (!isInteracting) return;
    
    const newRating = calculateRating(clientX);
    setRating(newRating);
    setInteractiveRating(newRating);
    setIsInteracting(false);
    
    onChange?.(newRating);
  }, [isInteracting, calculateRating, onChange]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    handleStartInteraction(e.clientX);
  }, [handleStartInteraction]);

  const handleMouseMove = useCallback((e) => {
    handleMoveInteraction(e.clientX);
  }, [handleMoveInteraction]);

  const handleMouseUp = useCallback((e) => {
    handleEndInteraction(e.clientX);
  }, [handleEndInteraction]);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    handleStartInteraction(touch.clientX);
  }, [handleStartInteraction]);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    handleMoveInteraction(touch.clientX);
  }, [handleMoveInteraction]);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    handleEndInteraction(touch.clientX);
  }, [handleEndInteraction]);

  const currentRating = isInteracting ? interactiveRating : rating;

  // Render individual star with half-star support
  const renderStar = useCallback((index) => {
    const starValue = index + 0.5;
    const isFull = currentRating >= starValue + 0.5;
    const isHalf = currentRating >= starValue && currentRating < starValue + 0.5;
    
    if (isHalf) {
      return (
        <div
          key={index}
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '24px',
            height: '24px',
            margin: '0 2px'
          }}
        >
          {/* Background star */}
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#e4e5e9',
              fontSize: '24px',
              lineHeight: '24px'
            }}
          >
            ★
          </span>
          {/* Half-filled overlay */}
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#ffc107',
              fontSize: '24px',
              lineHeight: '24px',
              width: '50%',
              overflow: 'hidden'
            }}
          >
            ★
          </span>
        </div>
      );
    }

    return (
      <span
        key={index}
        style={{
          color: isFull ? '#ffc107' : '#e4e5e9',
          fontSize: '24px',
          lineHeight: '24px',
          margin: '0 2px',
          display: 'inline-block',
          width: '24px',
          height: '24px',
          transition: 'color 0.1s ease'
        }}
      >
        ★
      </span>
    );
  }, [currentRating]);

  return (
    <div
      ref={containerRef}
      style={{
        width: 'fit-content',
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '8px 4px',
        touchAction: 'none',
        background: 'transparent'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Render 5 stars with half-star capability */}
      {[0, 1, 2, 3, 4].map(renderStar)}
      
      {/* Current rating indicator during interaction */}
      {isInteracting && (
        <div
          style={{
            position: 'absolute',
            top: '-60%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#666',
            background: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginTop: '4px',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          {currentRating.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default StarRating;